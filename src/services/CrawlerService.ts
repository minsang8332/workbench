import _ from 'lodash'
import path from 'path'
import scheduler, { Job } from 'node-schedule'
import { dialog, BrowserWindow, Event, session, app } from 'electron'
import HistoryRepository from '@/repositories/crawler/HistoryRepository'
import WorkerRepository from '@/repositories/crawler/WorkerRepository'
import ScheduleRepository from '@/repositories/crawler/ScheduleRepository'
import { ClickCommand, CursorCommand, RedirectCommand, WriteCommand, ScrapCommand } from '@/models/crawler/Command'
import History from '@/models/crawler/History'
import { CRAWLER_COMMAND, CRAWLER_STATUS } from '@/constants/model'
import { IPCError } from '@/errors/ipc'
import windowUtil from '@/utils/window'
import logger from '@/logger'
import type { Crawler } from '@/types/model'
class CrawlerService {
    private _blocking = false
    private _workerRepository: WorkerRepository
    private _historyRepository: HistoryRepository
    private _scheduleRepository: ScheduleRepository
    private static _schedules: { [key: Crawler.ISchedule['id']]: Job } = {}
    constructor() {
        this._workerRepository = new WorkerRepository()
        this._historyRepository = new HistoryRepository()
        this._scheduleRepository = new ScheduleRepository()
    }
    getWorker(id: Crawler.IWorker['id']) {
        return this._workerRepository.findOne(id)
    }
    // Plain 객체를 Class 객체로 구조화한다.
    build(commands: Crawler.IWorker['commands'], headless: boolean = false) {
        let builder = []
        for (let i = 0; i < commands.length; i++) {
            switch (commands[i].name) {
                case CRAWLER_COMMAND.REDIRECT: {
                    const command = commands[i] as Crawler.Command.IRedirect
                    builder.push(
                        new RedirectCommand(command.url, {
                            timeout: command.timeout,
                        })
                    )
                    break
                }
                case CRAWLER_COMMAND.CLICK: {
                    const command = commands[i] as Crawler.Command.IClick
                    if (_.isEmpty(command.selector) && headless === false) {
                        builder.push(new CursorCommand())
                    }
                    builder.push(
                        new ClickCommand(command.selector, {
                            timeout: command.timeout,
                            pointer: i,
                        })
                    )
                    break
                }
                case CRAWLER_COMMAND.WRITE: {
                    const command = commands[i] as Crawler.Command.IWrite
                    if (_.isEmpty(command.selector) && headless === false) {
                        builder.push(new CursorCommand())
                    }
                    builder.push(
                        new WriteCommand(command.selector, command.text, {
                            timeout: command.timeout,
                            pointer: i,
                        })
                    )
                    break
                }
                case CRAWLER_COMMAND.SCRAP: {
                    const command = commands[i] as Crawler.Command.IScrap
                    if (_.isEmpty(command.selector) && headless === false) {
                        builder.push(new CursorCommand())
                    }
                    builder.push(
                        new ScrapCommand(command.selector, {
                            timeout: command.timeout,
                            pointer: i,
                        })
                    )
                    break
                }
            }
        }
        return builder
    }
    async run(worker: Crawler.IWorker, window: BrowserWindow, headless: boolean = false): Promise<Crawler.IHistory> {
        // window.webContents.openDevTools()
        let round = 0
        let selector = null
        let history = new History({
            workerId: worker.id,
            startedAt: new Date(),
        })
        let builder = this.build(worker.commands, headless)
        try {
            history.setLabel(worker.label).setCommands(worker.commands).setTotalRound(builder.length)
            for (let i = 0; i < builder.length; i++) {
                window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
                round++
                while (this._blocking) {
                    await new Promise((resolve) => setTimeout(resolve, 500))
                }
                let command = builder[i]
                if (command instanceof CursorCommand) {
                    selector = await this.cursor(command, window)
                    continue
                }
                if (command instanceof RedirectCommand) {
                    await this.redirect(command, window)
                    continue
                }
                if (command instanceof ClickCommand) {
                    if (!_.isNull(selector)) {
                        command.selector = selector
                        if (_.isNumber(command.pointer) && worker.commands[command.pointer]) {
                            ;(worker.commands[command.pointer] as Crawler.Command.IWrite).selector = command.selector
                        }
                        selector = null
                    }
                    window.webContents.setWindowOpenHandler(({ url }) => {
                        window.loadURL(url)
                        return { action: 'deny' }
                    })
                    await this.click(command, window)
                    continue
                }
                if (command instanceof WriteCommand) {
                    if (!_.isNull(selector)) {
                        command.selector = selector
                        if (_.isNumber(command.pointer) && worker.commands[command.pointer]) {
                            ;(worker.commands[command.pointer] as Crawler.Command.IWrite).selector = command.selector
                        }
                        selector = null
                    }
                    await this.write(command, window)
                    continue
                }
                if (command instanceof ScrapCommand) {
                    if (!_.isNull(selector)) {
                        command.selector = selector
                        if (_.isNumber(command.pointer) && worker.commands[command.pointer]) {
                            ;(worker.commands[command.pointer] as Crawler.Command.IScrap).selector = command.selector
                        }
                        selector = null
                    }
                    let textContent = await this.scrap(command, window)
                    if (textContent && _.isString(textContent)) {
                        history.results.push(textContent)
                    }
                }
            }
            history.setStatus(CRAWLER_STATUS.COMPLETE).setMessage('정상적으로 실행이 종료되었습니다.')
        } catch (error) {
            history.setStatus(CRAWLER_STATUS.FAILED).setMessage(error)
        }
        // 만약 커서 명령이 포함되어 있다면 selector 를 업데이트 해주도록 한다.
        if (builder.find((command) => command instanceof CursorCommand)) {
            this._workerRepository.update(worker)
        }
        history.setRound(round).setEndedAt(new Date())
        this.addHistory(history)
        return history
    }
    // 이동하기
    async redirect(command: RedirectCommand, window: BrowserWindow) {
        logger.debug('START_REDIRECT ' + _.toString(command.url))
        const promise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Redirect 시간 초과')), command.timeout)
            const clear = () => {
                clearTimeout(timer)
                window.webContents.removeListener('did-finish-load', onDidFinishLoad)
            }
            const onDidFinishLoad = () => {
                clear()
                resolve(true)
            }
            window.webContents.on('did-finish-load', onDidFinishLoad)
            window.loadURL(command.url)
        })
        logger.debug('END_REDIRECT')
        return await promise
    }
    // 클릭하기
    async click(command: ClickCommand, window: BrowserWindow) {
        logger.debug('START_CLICK ' + _.toString(command.selector))
        window.webContents.setWindowOpenHandler(({ url }) => {
            window.loadURL(url)
            return { action: 'deny' }
        })
        const promise = await new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                    (() => {
                        return new Promise((resolve, reject) => {
                            const onClear = () => {
                                clearTimeout(timer)
                                clearInterval(intval)
                                window.removeEventListener('beforeunload', onClear)
                            }
                            window.addEventListener('beforeunload', onClear)
                            const intval = setInterval(() => {
                                const element = document.querySelector('${command.selector}')
                                if (element) {
                                    element.click()
                                    onClear()
                                    resolve(true)
                                } else if (element && element.tagName) {
                                    reject(new Error('클릭할 수 없는 요소입니다: '))
                                }
                            }, 1000)
                            const timer = setTimeout(() => {
                                onClear()
                                reject(new Error('${command.selector} 을/를 클릭 할 수 없습니다.'))
                            }, ${command.timeout})
                        })
                    })()
                `
                )
                .then(() => resolve(true))
                .catch((e) => reject(e.message))
        })
        logger.debug(`END_CLICK ${promise}`)
        return await promise
    }
    // 입력하기
    async write(command: WriteCommand, window: BrowserWindow) {
        logger.debug('START_WRITE ' + _.toString(command.selector))
        const promise = new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                    (() => {
                        return new Promise((resolve, reject) => {
                            const onClear = () => {
                                clearTimeout(timer)
                                clearInterval(intval)
                                window.removeEventListener('beforeunload', onClear)
                            }
                            window.addEventListener('beforeunload', onClear)
                            const intval = setInterval(() => {
                                const element = document.querySelector('${command.selector}')
                                if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.type !== 'file') {
                                    element.value = '${command.text}'
                                    element.dispatchEvent(new Event('input'))
                                    onClear()
                                    resolve(true)
                                } else if (element.tagName) {
                                    reject(new Error('입력할 수 없는 요소입니다 ' + element.tagName))
                                }
                            }, 1000)
                            const timer = setTimeout(() => {
                                onClear()
                                reject(new Error('입력 요소를 찾을 수 없습니다.'))
                            }, ${command.timeout})
                        })
                    })()
                `
                )
                .then(() => resolve(true))
                .catch((e) => reject(e.message))
        })
        logger.debug('END_WRITE')
        return await promise
    }
    // 스크랩하기
    async scrap(command: ClickCommand, window: BrowserWindow) {
        logger.debug('START_SCRAP ' + _.toString(command.selector))
        const textContent = await new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                    (() => {
                        return new Promise((resolve, reject) => {
                            const onClear = () => {
                                clearTimeout(timer)
                                clearInterval(intval)
                                window.removeEventListener('beforeunload', onClear)
                            }
                            window.addEventListener('beforeunload', onClear)
                            const intval = setInterval(() => {
                                const element = document.querySelector('${command.selector}')
                                if (element) {
                                    onClear()
                                    resolve(element.textContent)
                                } else if (element.tagName) {
                                    reject(new Error('스크랩할 수 없는 요소입니다: ' + element.tagName))
                                }
                            }, 1000)
                            const timer = setTimeout(() => {
                                onClear()
                                reject(new Error('스크랩 요소를 찾을 수 없습니다.'))
                            }, ${command.timeout})
                        })
                    })()
                `
                )
                .then((result) => {
                    resolve(result)
                })
                .catch((e) => reject(e.message))
        })
        logger.debug('END_SCRAP')
        return textContent
    }
    // 요소 선택하기
    async cursor(command: CursorCommand, window: BrowserWindow) {
        logger.debug('START_CURSOR')
        await dialog.showMessageBox(window, {
            type: 'none',
            buttons: ['확인'],
            title: '자동화 안내',
            message: '마우스 커서로 대상을 클릭해 주세요.',
        })
        let selector: string = await new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                    (() => {
                        const style = document.createElement('style')
                        style.classList.add('web-crawler-style')
                        style.innerHTML = '.web-crawler--mouseover { border: 2px dotted red !important; }'
                        document.head.appendChild(style)
                        const onMouseover = (event) => {
                            const element = event.target
                            element.classList.add('web-crawler--mouseover')
                        }
                        const onMouseout = (event) => {
                            const element = event.target
                            element.classList.remove('web-crawler--mouseover')
                        }
                        return new Promise((resolve, reject) => {
                            const onClick = (event) => {
                                event.preventDefault()
                                event.stopImmediatePropagation()
                                let path = []
                                try {                                    
                                    let element = event.target
                                    element.classList.remove('web-crawler--mouseover')
                                    while (element && element.nodeType === 1) {
                                        let selector = element.tagName.toLowerCase()
                                        if (element.id) {
                                            selector = '#' + element.id
                                            path.unshift(selector)
                                            break
                                        } else {
                                            let sibling = element
                                            let nthChild = 1
                                            while (sibling = sibling.previousElementSibling) {
                                                if (sibling.tagName === element.tagName) {
                                                    nthChild++
                                                }
                                            }
                                            selector += ':nth-of-type(' + nthChild + ')'
                                        }
                                        path.unshift(selector)
                                        element = element.parentElement
                                    }
                                    const selector = path.join(' > ')
                                    resolve(selector)
                                } catch (e) {
                                    reject(e.stack)
                                }
                                document.removeEventListener('mouseover', onMouseover)
                                document.removeEventListener('mouseout', onMouseout)
                                document.removeEventListener('click', onClick)
                            }
                            document.addEventListener('mouseover', onMouseover)
                            document.addEventListener('mouseout', onMouseout)
                            document.addEventListener('click', onClick)
                        })
                    })()
                `
                )
                .then((selector) => resolve(selector))
                .catch((e) => reject(e))
        })
        selector = _.toString(selector).replace(/[\.]/, '\\\\.')
        logger.debug('END_CURSOR ' + selector)
        return selector
    }
    createWindow() {
        const partition = new Date().getTime().toString()
        const parent = windowUtil.getMainWindow()
        const window = windowUtil.createWindow({
            partition,
            width: 480,
            height: 720,
            parent,
            frame: true,
            resizable: true,
            devTools: !app.isPackaged,
        })
        const sess = session.fromPartition(partition)
        // 다운로드가 발생하면 모달은 생략하고 downloads 폴더에 내려받도록 함
        sess.on('will-download', (event, item, webContents) => {
            const filePath = path.join(app.getPath('downloads'), item.getFilename())
            item.setSavePath(filePath)
        })
        // 화면 이동중에는 블로킹
        window.webContents.on('did-start-navigation', (event, url, isInPlace) => {
            if (isInPlace) {
                logger.debug('REDIRECT ' + _.toString(url))
                this.setBlocking(true)
            }
        })
        window.webContents.on('did-navigate', (event) => this.setBlocking(false))
        window.webContents.on('did-navigate-in-page', (event) => this.setBlocking(false))
        window.webContents.on('did-finish-load', () => this.setBlocking(false))
        window.webContents.on('did-fail-load', () => this.setBlocking(false))
        window.on('close', () => {
            this.setBlocking(false)
        })
        return window
    }
    detectClose(window: BrowserWindow) {
        return new Promise((_, reject) => {
            window.on('close', () => {
                reject(new IPCError('창이 닫혀 작업이 종료되었습니다.'))
            })
        })
    }
    setBlocking(payload: boolean = false) {
        this._blocking = payload
        return this
    }
    addHistory(history: History) {
        this._historyRepository.insert(history)
        return this
    }
    // 스케줄 실행하기
    async consumeSchedule(scheduleId: Crawler.ISchedule['id'], firedAt: Date) {
        const schedule = this._scheduleRepository.findOne(scheduleId)
        if (_.isEmpty(schedule)) {
            return
        }
        // 비활성화 상태가 되면 스케줄링을 스킵
        if (!schedule.active) {
            return
        }
        this._scheduleRepository.updateStatus(scheduleId, CRAWLER_STATUS.RUNNING, firedAt)
        const worker = this._workerRepository.findOne(schedule.workerId)
        if (!worker) {
            throw new IPCError(`Worker 가 유효하지 않습니다. (ID: ${schedule.workerId})`)
        }
        const window = this.createWindow()
        // 스케줄링은 윈도우 화면이 닫힌 상태로 진행되기에 메모리 누수가 발생할 수 있다
        // 타이머를 설정하여 초과하면 강제로 에러를 발생시키도록 함. provideScheduler 클로져가 유효하기에 로그가 남을 것
        const detectTimeout = new Promise((_, reject) => setTimeout(() => reject(), 1000 * 60 * 5))
        await Promise.all([this.run(worker, window, true), detectTimeout]).finally(window.close)
        this._scheduleRepository.updateStatus(scheduleId, CRAWLER_STATUS.WAITING)
    }
    // 스케줄러 설정하기
    async provideSchedules() {
        const schedules = this._scheduleRepository.findByPrepare()
        for (const schedule of schedules) {
            let job = null
            try {
                job = scheduler.scheduleJob(schedule.expression, (firedAt) =>
                    this.consumeSchedule(schedule.id, firedAt)
                )
                CrawlerService._schedules[schedule.id] = job
                this._scheduleRepository.updateStatus(schedule.id, CRAWLER_STATUS.WAITING)
            } catch (e) {
                this._scheduleRepository.updateStatus(schedule.id, CRAWLER_STATUS.CANCELED)
                logger.error(e)
                if (job) {
                    job.cancel()
                }
            }
        }
    }
    // 스케줄러 중단
    shutdownScheduler() {
        CrawlerService._schedules = {}
        return scheduler.gracefulShutdown()
    }
}
export default CrawlerService
