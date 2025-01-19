import _ from 'lodash'
import path from 'path'
import { dialog, BrowserWindow, Event, session, app } from 'electron'
import History from '@/models/crawler/History'
import HistoryRepository from '@/repositories/crawler/HistoryRepository'
import windowUtil from '@/utils/window'
import { ClickCommand, CursorCommand, RedirectCommand, WriteCommand } from '@/models/crawler/Command'
import { IPCError } from '@/errors/ipc'
import { CRAWLER_COMMAND, CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
import WorkerRepository from '@/repositories/crawler/WorkerRepository'
class CrawlerService {
    private _blocking = false
    private _headless = false
    private _workerRepository: WorkerRepository
    private _historyRepository: HistoryRepository
    constructor() {
        this._workerRepository = new WorkerRepository()
        this._historyRepository = new HistoryRepository()
    }
    getWorker(id: Crawler.IWorker['id']) {
        return this._workerRepository.findOne(id)
    }
    build(worker: Crawler.IWorker) {
        if (_.isEmpty(worker)) {
            throw new IPCError('자동화 세트가 유효하지 않습니다.')
        }
        for (let i = 0; i < worker.commands.length; i++) {
            switch (worker.commands[i].name) {
                case CRAWLER_COMMAND.REDIRECT: {
                    const command = worker.commands[i] as Crawler.Command.IRedirect
                    worker.commands[i] = new RedirectCommand(command.url, {
                        timeout: command.timeout,
                    })
                    break
                }
                case CRAWLER_COMMAND.CLICK: {
                    const command = worker.commands[i] as Crawler.Command.IClick
                    if (_.isEmpty(command.selector)) {
                        worker.commands.splice(i, 0, new CursorCommand())
                        i++
                    }
                    worker.commands[i] = new ClickCommand(command.selector, {
                        timeout: command.timeout,
                    })
                    break
                }
                case CRAWLER_COMMAND.WRITE: {
                    const command = worker.commands[i] as Crawler.Command.IWrite
                    if (_.isEmpty(command.selector)) {
                        worker.commands.splice(i, 0, new CursorCommand())
                        i++
                    }
                    worker.commands[i] = new WriteCommand(command.selector, command.text, {
                        timeout: command.timeout,
                    })
                    break
                }
            }
        }
        return worker
    }
    async run(worker: Crawler.IWorker, window: BrowserWindow): Promise<Crawler.IHistory> {
        let history = new History({
            workerId: worker.id,
            startedAt: new Date(),
        })
        let round = 1
        let downloads: string[] = []
        let selector = null
        try {
            const { commands } = worker
            history.setCommands(commands)
            worker = this.build(worker)
            for (const command of worker.commands) {
                while (this._blocking) {
                    await new Promise((resolve) => setTimeout(resolve, 500))
                }
                if (command instanceof CursorCommand) {
                    console.log('START_CURSOR')
                    selector = await this.cursor(command, window)
                    console.log('END_CURSOR', selector)
                } else if (command instanceof RedirectCommand) {
                    await this.redirect(command, window)
                } else if (command instanceof ClickCommand) {
                    command.selector = selector ? selector : command.selector
                    console.log('START_CLICK', command.selector)
                    await this.click(command, window)
                    console.log('END_CLICK')
                    selector = null
                } else if (command instanceof WriteCommand) {
                    command.selector = selector ? selector : command.selector
                    console.log('START_WRITE', command.selector, command.text)
                    const writed = await this.write(command, window)
                    console.log('END_WRITE', writed)
                    selector = null
                }
                round++
            }
            history.setStatus(CRAWLER_STATUS.COMPLETE).setMessage('정상적으로 실행이 종료되었습니다.')
        } catch (error) {
            history.setStatus(CRAWLER_STATUS.FAILED).setError(error)
        }
        history.setRound(round).setDownloads(downloads).setEndedAt(new Date())
        this.addHistory(history)
        return history
    }
    // 이동하기
    async redirect(command: RedirectCommand, window: BrowserWindow) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Redirect 시간 초과')), command.timeout)
            const clear = () => {
                clearTimeout(timer)
                window.webContents.removeListener('did-finish-load', onDidFinishLoad)
                window.webContents.removeListener('did-fail-load', onDidFailLoad)
            }
            const onDidFinishLoad = () => {
                clear()
                resolve(true)
            }
            const onDidFailLoad = (event: Event, errorCode: number, errorDescription: string) => {
                clear()
                reject(new Error(errorDescription))
            }
            window.webContents.on('did-finish-load', onDidFinishLoad)
            window.webContents.on('did-fail-load', onDidFailLoad)
            window.loadURL(command.url)
        })
    }
    // 클릭하기
    async click(command: ClickCommand, window: BrowserWindow) {
        return new Promise((resolve, reject) => {
            // 팝업을 리다이렉션으로 변경
            window.webContents.setWindowOpenHandler(({ url }) => {
                window.loadURL(url)
                return { action: 'deny' }
            })
            window.webContents.once('did-finish-load', () => resolve(true))
            window.webContents.once('did-fail-load', () => resolve(true))
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
                                } else if (element.tagName) {
                                    reject(new Error('클릭할 수 없는 요소입니다: ' + element.tagName))
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
    }
    // 입력하기
    async write(command: WriteCommand, window: BrowserWindow) {
        return new Promise((resolve, reject) => {
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
                                    reject(new Error('입력할 수 없는 요소입니다: ' + element.tagName))
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
    }
    // 요소 선택하기
    async cursor(command: CursorCommand, window: BrowserWindow) {
        window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
        await dialog.showMessageBox(window, {
            type: 'none',
            buttons: ['확인'],
            title: '자동화 가이드',
            message: '마우스 커서를 이동하여 클릭해 주세요.',
        })
        const selector: string = await new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                    (() => {
                        const style = document.createElement('style')
                        style.classList.add('web-crawler-style')
                        style.innerHTML = '.web-crawler--mouseover { border: 2px dotted red !important; }'
                        document.head.appendChild(style)
                        const onMouseOver = (event) => {
                            const element = event.target
                            element.classList.add('web-crawler--mouseover')
                        }
                        const onMouseOut = (event) => {
                            const element = event.target
                            element.classList.remove('web-crawler--mouseover')
                        }
                        const getSelector = (el) => {
                            let path = []
                            while (el.nodeType === 1) {
                                let selector = el.tagName.toLowerCase()
                                if (el.id) {
                                    selector = '#' + el.id
                                    path.unshift(selector)
                                    break
                                } else {
                                    let sibling = el
                                    let nthChild = 1
                                    while (sibling = sibling.previousElementSibling) {
                                        if (sibling.tagName === el.tagName) {
                                            nthChild++
                                        }
                                    }
                                    selector += ':nth-of-type(' + nthChild + ')'
                                }
                                path.unshift(selector)
                                el = el.parentElement
                            }
                            return path.join(' > ')
                        }
                        return new Promise((resolve) => {
                            const onClickElement = (event) => {
                                const element = event.target
                                const selector = getSelector(element)
                                element.classList.remove('web-crawler--mouseover')
                                document.removeEventListener('mouseover', onMouseOver)
                                document.removeEventListener('mouseout', onMouseOut)
                                document.removeEventListener('click', onClickElement)
                                resolve(selector)
                            }
                            document.addEventListener('mouseover', onMouseOver)
                            document.addEventListener('mouseout', onMouseOut)
                            document.addEventListener('click', onClickElement)
                        })
                    })()
                `
                )
                .then((selector) => resolve(selector))
        })
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
                console.log('DID_START_NAVI', url)
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
    setHeadless(payload: boolean = false) {
        this._headless = payload
        return this
    }
    addHistory(history: History) {
        this._historyRepository.insert(history)
        return this
    }
}
export default CrawlerService
