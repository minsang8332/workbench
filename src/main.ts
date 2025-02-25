import _ from 'lodash'
import { app } from 'electron'
import windowUtil from '@/utils/window'
import protocolUtil from '@/utils/protocol'
import { SqliteDatasource } from '@/config/database'
import { PROTOCOL } from '@/constants/app'
import '@/controllers'
if (app.requestSingleInstanceLock() == false) {
    app.quit()
    process.exit(0)
}
app.on('will-finish-launching', () => {
    SqliteDatasource.connect()
    protocolUtil.registerMainWindow()
    protocolUtil.register(PROTOCOL.LOCAL, { stream: true })
})
app.on('ready', () => {
    protocolUtil.handleMainWindow()
    protocolUtil.handle(PROTOCOL.LOCAL)
    windowUtil.createMainWindow()
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
