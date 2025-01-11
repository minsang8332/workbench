import _ from 'lodash'
import path from 'path'
import { app, BrowserWindow, nativeImage, Event } from 'electron'
import windowUtil from '@/utils/window'
import logger from '@/logger'
import { checkForUpdates } from '@/controllers/app'
import { BROWSER_CRAWLER_COMMAND, BROWSER_CRWALER_STATUS } from '@/constants/window'
import { PROTOCOL } from '@/constants/app'
import type { BrowserCrawler } from '@/types/window'
let mainWindow: BrowserWindow
const createWindow = ({
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
const createMainWindow = () => {
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
const getMainWindow = () => {
    return mainWindow
}
const createBrowserCrawler = () => {
    let _queue: BrowserCrawler.ICommandSet[] = []
    let _queueLimit = 2
    const addQueue = (commandSet: BrowserCrawler.ICommandSet) => {
        if (_queue.length < _queueLimit && commandSet.status == BROWSER_CRWALER_STATUS.PREPARE) {
            commandSet.status = BROWSER_CRWALER_STATUS.WAITING
            _queue.push(commandSet)
        }
    }
    const run = async (commandSet: BrowserCrawler.ICommandSet) => {
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
                        await redirect(window, command as BrowserCrawler.IRedirectCommand)
                        break
                }
            }
            commandSet.status = BROWSER_CRWALER_STATUS.COMPLETE
            addHistory(commandSet, { message: '정상적으로 처리되었습니다.' })
        } catch (error) {
            commandSet.status = BROWSER_CRWALER_STATUS.FAILED
            addHistory(commandSet, { error: error as Error })
        }
        // window.close()
    }
    const redirect = async (window: BrowserWindow, command: BrowserCrawler.IRedirectCommand) => {
        return new Promise((resolve, reject) => {
            const webContents = window.webContents
            const timer = setTimeout(() => reject(new Error('페이지 로딩 시간 초과')), command.timeout)
            const loadListener = () => {
                clearTimeout(timer)
                webContents.removeListener('did-finish-load', loadListener)
                resolve(true)
            }
            const errorListener = (event: Event, errorCode: number, errorDescription: string) => {
                clearTimeout(timer)
                webContents.removeListener('did-finish-load', loadListener)
                reject(new Error(errorDescription))
            }
            webContents.on('did-finish-load', loadListener)
            webContents.on('did-fail-load', errorListener)
            window.loadURL(command.url)
        })
    }
    const addHistory = (
        commandSet: BrowserCrawler.ICommandSet,
        {
            message = null,
            error = null,
        }: {
            message?: BrowserCrawler.IHistory['message']
            error?: BrowserCrawler.IHistory['error']
        } = {}
    ) => {
        if (message) {
            logger.info(message)
        }
        if (error) {
            // logger.error(error)
        }
        // @TODO 스토어 저장
    }
    return {
        run,
    }
}
export default {
    createWindow,
    createMainWindow,
    getMainWindow,
    createBrowserCrawler,
}
