import _ from 'lodash'
import path from 'path'
import { app, BrowserWindow, nativeImage } from 'electron'
import { checkForUpdates } from '@/controllers/app'
import { PROTOCOL } from '@/constants/app'
let mainWindow: BrowserWindow
export const createWindow = ({
    partition,
    parent,
    width = 1024,
    height = 768,
    modal = false,
    frame = false,
    resizable = false,
    devTools = false,
}: {
    partition?: string
    parent?: BrowserWindow
    width?: number
    height?: number
    modal?: boolean
    frame?: boolean
    resizable?: boolean
    devTools?: boolean
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
            devTools,
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
        devTools: !app.isPackaged,
    })
    const onceLoad = () => {
        mainWindow.show()
        if (!app.isPackaged) {
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
export default {
    createWindow,
    createMainWindow,
    getMainWindow,
}
