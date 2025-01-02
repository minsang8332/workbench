import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import url from 'url'
import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { controller } from '@/utils/ipc'
import logger from '@/utils/logger'
import windowUtil from '@/utils/window'
import { IPC_APP } from '@/constants/ipc'
import { PROTOCOL } from '@/constants/app'
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
controller(
    IPC_APP.LOAD_OVERLAY_VIDEOS,
    async (request: IpcController.Request.App.ILoadOverlayVideos, response: IpcController.IResponse) => {
        /**
         * @TODO 환경 설정에서 오버레이 경로 설정하기
         */
        const videopath = path.resolve('C:/Users/minsa/OneDrive/사진')
        /** */
        // 파일이 없다면
        if (fs.existsSync(videopath) == false) {
            throw new Error('경로를 찾을 수 없습니다.')
        }
        const allowedExts = ['.mp4', '.avi', '.mov', '.mkv']
        const videos = fs
            .readdirSync(videopath)
            .filter((file) => allowedExts.includes(path.extname(file).toLowerCase()))
            .map((file) => {
                const videoURL = url.pathToFileURL(path.resolve(videopath, file))
                return videoURL.toString().replace('file://', `${PROTOCOL.LOCAL}://`)
            })
        response.data.videos = videos
        return response
    }
)
