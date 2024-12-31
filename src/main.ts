import { app } from 'electron'
import _ from 'lodash'
import '@/controllers'
import * as protocolTool from '@/services/protocol'
import windowTool from '@/services/window'
if (app.requestSingleInstanceLock() == false) {
    app.quit()
    process.exit(0)
}
app.on('will-finish-launching', () => {
    protocolTool.registerScheme('app')
})
app.on('ready', () => {
    protocolTool.handleProtocol('app')
    const mainWindow = windowTool.creaateWindow({
        scheme: 'app',
        url: process.env.APP_URL,
    })
    windowTool.setMainWindow(mainWindow)
})
app.on('window-all-closed', () => {
    app.quit()
})
app.on('second-instance', () => {
    let mainWindow = windowTool.getMainWindow()
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore()
        }
        mainWindow.focus()
    }
})
