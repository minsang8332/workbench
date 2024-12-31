import { app } from 'electron'
import _ from 'lodash'
import '@/controllers'
import * as protocolUtil from '@/utils/protocol'
import windowUtil from '@/utils/window'
if (app.requestSingleInstanceLock() == false) {
    app.quit()
    process.exit(0)
}
app.on('will-finish-launching', () => {
    protocolUtil.registerScheme('app')
})
app.on('ready', () => {
    protocolUtil.handleProtocol('app')
    const mainWindow = windowUtil.creaateWindow({
        scheme: 'app',
        url: process.env.APP_URL,
    })
    windowUtil.setMainWindow(mainWindow)
})
app.on('window-all-closed', () => {
    app.quit()
})
app.on('second-instance', () => {
    let mainWindow = windowUtil.getMainWindow()
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore()
        }
        mainWindow.focus()
    }
})
