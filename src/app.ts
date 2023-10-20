import { app, BrowserWindow } from 'electron'
app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
    })
    mainWindow.loadURL('http://localhost:8080')
    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.show()
    })
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
