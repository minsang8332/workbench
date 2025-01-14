import _ from 'lodash'
import path from 'path'
import { BrowserWindow, Event, session, app } from 'electron'
import History from '@/models/crawler/History'
import HistoryRepository from '@/repositories/crawler/HistoryRepository'
import windowUtil from '@/utils/window'
import { ClickCommand, CursorCommand, RedirectCommand, WriteCommand } from '@/models/crawler/Command'
import { IPCError } from '@/errors/ipc'
import { CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class CrawlerService {
    private _blocking = false
    private _historyRepository: HistoryRepository
    constructor() {
        this._historyRepository = new HistoryRepository()
    }
    async run(worker: Crawler.IWorker) {
        let round = 1
        let downloads: string[] = []
        let startedAt = new Date()
        try {
            const window = this.createWindow()
            window.show()
            for (const command of worker.commands) {
                // 블로킹 처리
                while (this._blocking) {
                    await new Promise((resolve) => setTimeout(resolve, 500))
                }
                if (command instanceof RedirectCommand) {
                    await this.redirect(window, command)
                } else if (command instanceof ClickCommand) {
                    await this.click(window, command)
                } else if (command instanceof WriteCommand) {
                    await this.write(window, command)
                } else if (command instanceof CursorCommand) {
                    await this.cursor(window, command)
                }
                round++
            }
            this.addHistory(
                new History({
                    workerId: worker.id,
                    status: CRAWLER_STATUS.COMPLETE,
                    message: '정상적으로 처리되었습니다.',
                    downloads,
                    startedAt,
                    endedAt: new Date(),
                })
            )
        } catch (error) {
            this.addHistory(
                new History({
                    workerId: worker.id,
                    status: CRAWLER_STATUS.FAILED,
                    error: error as Error,
                    errorRound: round,
                    downloads,
                    startedAt,
                    endedAt: new Date(),
                })
            )
        }
    }
    // 이동하기
    async redirect(window: BrowserWindow, command: RedirectCommand) {
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
    async click(window: BrowserWindow, command: ClickCommand) {
        return new Promise((resolve, reject) => {
            // 팝업은 막되 리다이렉션 허용
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
    async write(window: BrowserWindow, command: WriteCommand) {
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
    async cursor(window: BrowserWindow, command: CursorCommand) {
        window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
        window.setIgnoreMouseEvents(false)
        const selector = await new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
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
                `
                )
                .then((selector) => resolve(selector))
                .catch((e) => reject(e))
                .finally(() => window.setIgnoreMouseEvents(true))
        })
        return selector
    }
    createWindow() {
        const partition = new Date().getTime().toString()
        const window = windowUtil.createWindow({
            partition,
            width: 800,
            height: 600,
            parent: windowUtil.getMainWindow(),
            frame: true,
        })
        const sess = session.fromPartition(partition)
        // 다운로드가 발생하면 모달은 생략하고 downloads 폴더에 내려받도록 함
        sess.on('will-download', (event, item, webContents) => {
            const filePath = path.join(app.getPath('downloads'), item.getFilename())
            item.setSavePath(filePath)
        })
        // 화면 이동중 명령 처리를 블로킹 하도록 함
        window.webContents.on('did-start-navigation', (event, url) => {
            this._blocking = true
        })
        window.webContents.on('did-finish-load', () => {
            this._blocking = false
        })
        window.webContents.on('did-fail-load', () => {
            this._blocking = false
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
    addHistory(history: History) {
        this._historyRepository.insert(history)
    }
}
export default CrawlerService
