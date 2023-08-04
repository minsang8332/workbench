import { app, BrowserWindow } from 'electron'
import electronReload from 'electron-reload'
electronReload(__dirname, {})
app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })
    mainWindow.loadURL('/')
})
app.on('activate', () => {
    const windows = BrowserWindow.getAllWindows()
    if (!(windows && windows.length == 0)) {
        return
    }
    /** @TODO 화면 다시 열기 */
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
