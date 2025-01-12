import _ from 'lodash'
import { BrowserWindow, Event } from 'electron'
import windowUtil from '@/utils/window'
import logger from '@/logger'
import { CRAWLER_COMMAND, CRWALER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class CrawlerService {
    private _queue: Crawler.ICommandSet[] = []
    private _queueLimit = 2
    constructor(queueLimit: number = 2) {
        this._queueLimit = queueLimit
    }
    addQueue(commandSet: Crawler.ICommandSet) {
        if (this._queue.length < this._queueLimit && commandSet.status == CRWALER_STATUS.PREPARE) {
            commandSet.status = CRWALER_STATUS.WAITING
            this._queue.push(commandSet)
        }
    }
    async run(commandSet: Crawler.ICommandSet) {
        let round = 1
        let downloads: string[] = []
        let startedAt = new Date()
        try {
            if (commandSet.status != CRWALER_STATUS.WAITING) {
                throw new Error(`명령어 세트는 대기상태가 아닙니다. (status: ${commandSet.status})`)
            }
            // 실행중으로 변경
            commandSet.status = CRWALER_STATUS.RUNNING
            // 화면 생성
            const window = windowUtil.createWindow({
                partition: new Date().toString(),
                width: 800,
                height: 600,
                parent: windowUtil.getMainWindow(),
            })
            // 이동 중일 때에는 명령어를 잠시 멈춰야 함
            let blocking = false
            window.webContents.on('did-start-navigation', (event, url) => {
                blocking = true
            })
            window.webContents.on('did-finish-load', () => {
                blocking = false
            })
            window.webContents.on('did-fail-load', () => {
                blocking = false
            })
            /** @TODO 스케줄링의 경우 화면 끈상태로 동작 할 것 */
            window.show()
            for (const command of commandSet.commands) {
                window.setIgnoreMouseEvents(true)
                // 블로킹 상태일 때에는 대기하도록 한다.
                while (blocking) {
                    await new Promise((resolve) => setTimeout(resolve, 500))
                }
                switch (command.type) {
                    case CRAWLER_COMMAND.REDIRECT:
                        await this.redirect(window, command as Crawler.IRedirectCommand)
                        break
                    case CRAWLER_COMMAND.CLICK:
                        await this.click(window, command as Crawler.IClickCommand)
                        break
                    case CRAWLER_COMMAND.WRITE:
                        await this.write(window, command as Crawler.IWriteCommand)
                        break
                    case CRAWLER_COMMAND.CURSOR:
                        await this.cursor(window, command as Crawler.ICursorCommand)
                        break
                }
                round++
            }
            commandSet.status = CRWALER_STATUS.COMPLETE
            this.addHistory({
                commandSet,
                message: '정상적으로 처리되었습니다.',
                downloads,
                startedAt,
                endedAt: new Date(),
            })
        } catch (error) {
            commandSet.status = CRWALER_STATUS.FAILED
            this.addHistory({
                commandSet,
                error: error as Error,
                errorRound: round,
                downloads,
                startedAt,
                endedAt: new Date(),
            })
        }
        /** @TODO 화면이 켜져있으면 닫도록 한다 */
        // window.close()
    }
    // 이동하기
    async redirect(window: BrowserWindow, command: Crawler.IRedirectCommand) {
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
    async click(window: BrowserWindow, command: Crawler.IClickCommand) {
        return new Promise((resolve, reject) => {
            // 팝업은 막되 리다이렉션
            window.webContents.setWindowOpenHandler(({ url }) => {
                window.loadURL(url)
                return { action: 'deny' }
            })
            window.webContents
                .executeJavaScript(
                    `
                new Promise((resolve, reject) => {
                    const timeout = ${command.timeout}
                    const startTime = Date.now()
                    const observer = new MutationObserver(() => {
                        const element = document.querySelector('${command.selector}')
                        if (element) {
                            element.click()
                            observer.disconnect()
                            clearTimeout(timer)
                            resolve(true)
                        }
                    })
                    observer.observe(document.body, { childList: true, subtree: true })
                    const timer = setTimeout(() => {
                        observer.disconnect()
                        reject(new Error('선택자를 찾을 수 없습니다.'))
                    }, timeout)
                })
                `
                )
                .then(() => resolve(true))
                .catch((e) => reject(e.message))
        })
    }
    // 입력하기
    async write(window: BrowserWindow, command: Crawler.IWriteCommand) {
        return new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                new Promise((resolve, reject) => {
                    const timeout = ${command.timeout}
                    const startTime = Date.now()
                    const observer = new MutationObserver(() => {
                        const element = document.querySelector('${command.selector}')
                        if (element) {
                            element.value = '${command.text}'
                            element.dispatchEvent(new Event('input'))
                            observer.disconnect()
                            clearTimeout(timer)
                            resolve(true)
                        }
                    })
                    observer.observe(document.body, { childList: true, subtree: true })
                    const timer = setTimeout(() => {
                        observer.disconnect()
                        reject(new Error('선택자를 찾을 수 없습니다.'))
                    }, timeout)
                })
                `
                )
                .then(() => resolve(true))
                .catch((e) => reject(e.message))
        })
    }
    // HTML 요소 클릭하기
    async cursor(window: BrowserWindow, command: Crawler.ICursorCommand) {
        window.setIgnoreMouseEvents(false)
        window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
        const selector = await window.webContents.executeJavaScript(`
            const style = document.createElement('style')
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
            new Promise((resolve) => {
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
        `)
        return selector
    }
    addHistory({
        commandSet = null,
        message = null,
        error = null,
        errorRound = null,
        downloads = [],
        startedAt,
        endedAt,
    }: {
        commandSet: Crawler.ICommandSet | null
        message?: string | null
        error?: Error | null
        errorRound?: number | null
        downloads: string[]
        startedAt: Date
        endedAt: Date
    }) {
        console.error({ message, error })
        // @TODO 스토어 저장
    }
}
export default CrawlerService
