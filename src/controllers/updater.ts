import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import logger from '@/logger'
import windowService from '@/services/window'
import { IPC_UPDATER } from '@/constants/ipc'
// 앱 종료시 자동 업데이트
autoUpdater.autoInstallOnAppQuit = false
let update: boolean = false
export const checkForUpdates = () => {
    if (app.isPackaged) {
        autoUpdater.checkForUpdates()
    }
}
ipcMain.handle(IPC_UPDATER.AVAILABLE, () => {
    return {
        update,
    }
})
ipcMain.on(IPC_UPDATER.AVAILABLE, () => {
    let mainWindow = windowService.getMainWindow()
    if (mainWindow) {
        mainWindow.webContents.send(IPC_UPDATER.AVAILABLE, update)
    }
})
ipcMain.on(IPC_UPDATER.INSTALL, () => {
    try {
        autoUpdater.quitAndInstall()
    } catch (e) {
        logger.error(e)
    }
})
// 업데이트 가능 여부
autoUpdater.on('update-available', (event) => {
    let mainWindow = windowService.getMainWindow()
    if (mainWindow) {
        mainWindow.webContents.send(IPC_UPDATER.AVAILABLE)
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
