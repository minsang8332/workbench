import path from 'path'
import { app, BrowserWindow, nativeImage, Event } from 'electron'
import { checkForUpdates } from '@/controllers/app'
let mainWindow: BrowserWindow
const creaateWindow = ({
    scheme = 'file',
    url = '',
    width = 1024,
    height = 768,
}: {
    scheme: string
    url?: string
    width?: number
    height?: number
}) => {
    const icon = path.join(__dirname, 'assets', 'favicon.png')
    if (app.dock && process.platform == 'darwin') {
        app.dock.setIcon(nativeImage.createFromPath(icon))
    }
    const window: BrowserWindow = new BrowserWindow({
        width,
        minWidth: width,
        height,
        minHeight: 360,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        title: `${app.getName()} v${app.getVersion()}`,
        icon,
        frame: !app.isPackaged,
        show: false,
    })
    window.setMenu(null)
    window.loadURL(app.isPackaged ? `${scheme}://./index.html` : url)
    const onceLoad = () => {
        window.show()
        if (app.isPackaged == false) {
            window.webContents.openDevTools()
        }
        checkForUpdates()
    }
    window.webContents.once('dom-ready', onceLoad)
    window.webContents.once('did-navigate', onceLoad)
    window.on('page-title-updated', (e) => {
        e.preventDefault()
    })
    window.webContents.on('will-navigate', (e) => e.preventDefault())
    return window
}
const setMainWindow = (window: BrowserWindow) => {
    mainWindow = window
}
const getMainWindow = () => {
    return mainWindow
}
export default {
    creaateWindow,
    setMainWindow,
    getMainWindow,
}
