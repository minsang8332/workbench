import { app } from 'electron'
import _ from 'lodash'
import '@/controllers'
import * as protocolUtil from '@/utils/protocol'
import windowUtil from '@/utils/window'
import { PROTOCOL } from './constants/app'
if (app.requestSingleInstanceLock() == false) {
    app.quit()
    process.exit(0)
}
app.on('will-finish-launching', () => {
    protocolUtil.registerMainWindow()
    protocolUtil.registerScheme(PROTOCOL.LOCAL, { stream: true })
})
app.on('ready', () => {
    protocolUtil.handleMainWindow()
    protocolUtil.handle(PROTOCOL.LOCAL)
    const mainWindow = windowUtil.creaateWindow({
        scheme: PROTOCOL.MAIN_WINDOW,
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
