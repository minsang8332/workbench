import _ from 'lodash'
import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { controller } from '@/utils/ipc'
import logger from '@/logger'
import windowUtil from '@/utils/window'
import { IPC_APP } from '@/constants/ipc'
// 앱 종료시 자동 업데이트
autoUpdater.autoInstallOnAppQuit = false
let update: boolean = false
export const checkForUpdates = () => {
    if (app.isPackaged) {
        autoUpdater.checkForUpdates()
    }
}
// 업데이트 가능 여부
autoUpdater.on('update-available', (event) => {
    let mainWindow = windowUtil.getMainWindow()
    if (mainWindow) {
        mainWindow.webContents.send(IPC_APP.AVAILABLE_UPDATE)
        update = true
    }
})
autoUpdater.on('update-downloaded', (event) => {
    logger.info({
        message: '업데이트 다운로드 완료',
        event,
    })
})
autoUpdater.on('error', (error, message) => {
    if (error.message) {
        message = error.message
    }
    logger.error(message)
})
ipcMain.on(IPC_APP.EXIT, () => app.quit())
ipcMain.on(IPC_APP.INSTALL_UPDATE, () => {
    try {
        autoUpdater.quitAndInstall()
    } catch (e) {
        logger.error(e)
    }
})
ipcMain.on(IPC_APP.AVAILABLE_UPDATE, () => {
    let mainWindow = windowUtil.getMainWindow()
    if (mainWindow) {
        mainWindow.webContents.send(IPC_APP.AVAILABLE_UPDATE, update)
    }
})
controller(IPC_APP.AVAILABLE_UPDATE, (request: unknown, response: IpcController.IResponse) => {
    return response
})
