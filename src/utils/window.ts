import _ from 'lodash'
import path from 'path'
import { app, BrowserWindow, nativeImage, Event } from 'electron'
import windowUtil from '@/utils/window'
import logger from '@/logger'
import { checkForUpdates } from '@/controllers/app'
import { BROWSER_CRAWLER_COMMAND, BROWSER_CRWALER_STATUS } from '@/constants/window'
import { PROTOCOL } from '@/constants/app'
import { type WindowUtil } from '@/types/window'
let mainWindow: BrowserWindow
export const createWindow = ({
    partition,
    parent,
    width = 1024,
    height = 768,
    modal = false,
    frame = false,
    resizable = false,
}: {
    partition?: string
    parent?: BrowserWindow
    width?: number
    height?: number
    modal?: boolean
    frame?: boolean
    resizable?: boolean
} = {}) => {
    const icon = path.join(__dirname, 'assets', 'favicon.png')
    if (app.dock && process.platform == 'darwin') {
        app.dock.setIcon(nativeImage.createFromPath(icon))
    }
    const window: BrowserWindow = new BrowserWindow({
        parent,
        width,
        minWidth: width,
        height,
        minHeight: 360,
        webPreferences: {
            contextIsolation: true,
            partition,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: `${app.getName()} v${app.getVersion()}`,
        icon,
        modal,
        frame,
        resizable,
        show: false,
    })
    window.setMenu(null)
    return window
}
export const createMainWindow = () => {
    mainWindow = createWindow({
        frame: true,
        resizable: true,
    })
    const onceLoad = () => {
        mainWindow.show()
        if (app.isPackaged == false) {
            mainWindow.webContents.openDevTools()
        }
        checkForUpdates()
    }
    mainWindow.webContents.once('dom-ready', onceLoad)
    mainWindow.webContents.once('did-navigate', onceLoad)
    mainWindow.on('page-title-updated', (e) => {
        e.preventDefault()
    })
    mainWindow.webContents.on('will-navigate', (e) => e.preventDefault())
    mainWindow.loadURL(app.isPackaged ? `${PROTOCOL.MAIN_WINDOW!}://./index.html` : process.env.APP_URL!)
}
export const getMainWindow = () => {
    return mainWindow
}
export class BrowserCrawler {
    private _queue: WindowUtil.ICommandSet[] = []
    private _queueLimit = 2
    constructor(queueLimit: number = 2) {
        this._queueLimit = queueLimit
    }
    addQueue(commandSet: WindowUtil.ICommandSet) {
        if (this._queue.length < this._queueLimit && commandSet.status == BROWSER_CRWALER_STATUS.PREPARE) {
            commandSet.status = BROWSER_CRWALER_STATUS.WAITING
            this._queue.push(commandSet)
        }
    }
    async run(commandSet: WindowUtil.ICommandSet) {
        try {
            if (commandSet.status != BROWSER_CRWALER_STATUS.WAITING) {
                throw new Error(`명령어 세트는 대기상태가 아닙니다. (status: ${commandSet.status})`)
            }
            // 실행중으로 변경
            commandSet.status = BROWSER_CRWALER_STATUS.RUNNING
            const window = windowUtil.createWindow({
                partition: new Date().toString(),
                width: 800,
                height: 600,
                parent: windowUtil.getMainWindow(),
            })
            window.show()
            for (const command of commandSet.commands) {
                switch (command.type) {
                    case BROWSER_CRAWLER_COMMAND.REDIRECT:
                        await this.redirect(window, command as WindowUtil.IRedirectCommand)
                        break
                    case BROWSER_CRAWLER_COMMAND.CLICK:
                        await this.click(window, command as WindowUtil.IClickCommand)
                        break
                }
            }
            commandSet.status = BROWSER_CRWALER_STATUS.COMPLETE
            this.addHistory(commandSet, { message: '정상적으로 처리되었습니다.' })
        } catch (error) {
            commandSet.status = BROWSER_CRWALER_STATUS.FAILED
            this.addHistory(commandSet, { error: error as Error })
        }
        // window.close()
    }
    // 이동하기
    async redirect(window: BrowserWindow, command: WindowUtil.IRedirectCommand) {
        return new Promise((resolve, reject) => {
            const webContents = window.webContents
            const timer = setTimeout(() => reject(new Error('Redirect 시간 초과')), command.timeout)
            const clear = () => {
                clearTimeout(timer)
                webContents.removeListener('did-finish-load', onDidFinishLoad)
                webContents.removeListener('did-fail-load', onDidFailLoad)
            }
            const onDidFinishLoad = () => {
                clear()
                resolve(true)
            }
            const onDidFailLoad = (event: Event, errorCode: number, errorDescription: string) => {
                clear()
                reject(new Error(errorDescription))
            }
            webContents.on('did-finish-load', onDidFinishLoad)
            webContents.on('did-fail-load', onDidFailLoad)
            window.loadURL(command.url)
        })
    }
    // 클릭하기
    async click(window: BrowserWindow, command: WindowUtil.IClickCommand) {
        return new Promise((resolve, reject) => {
            window.webContents
                .executeJavaScript(
                    `
                new Promise((resolve, reject) => {
                    const timeout = ${command.timeout}
                    const startTime = Date.now();
                    const observer = new MutationObserver(() => {
                    const element = document.querySelector('${command.selector}')
                    if (element) {
                        element.click()
                        observer.disconnect()
                        resolve(true)
                    }
                    })
                    observer.observe(document.body, { childList: true, subtree: true })
                    setTimeout(() => {
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
    async input() {}
    async selectElememt() {}
    addHistory(
        commandSet: WindowUtil.ICommandSet,
        {
            message = null,
            error = null,
        }: {
            message?: WindowUtil.IHistory['message']
            error?: WindowUtil.IHistory['error']
        } = {}
    ) {
        if (message) {
            logger.info(message)
        }
        if (error) {
            // logger.error(error)
            console.error(error)
        }
        // @TODO 스토어 저장
    }
}
export default {
    createWindow,
    createMainWindow,
    getMainWindow,
}
/*
  win.webContents.executeJavaScript(`
    setInterval(function() {
      const x = window.event.clientX || 0;
      const y = window.event.clientY || 0;
      
      const element = document.elementFromPoint(x, y); // 마우스 위치에 해당하는 엘리먼트 찾기
      if (element) {
        // 이전 배경색을 원래대로 복구
        const previousBackground = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(255, 255, 0, 0.5)'; // 투명한 노랑 배경색 적용

        // 1초 후 원래 배경색으로 복구
        setTimeout(() => {
          element.style.backgroundColor = previousBackground;
        }, 1000);
      }
    }, 1000); // 1초마다 실행
  `);
  */
