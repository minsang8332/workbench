import _ from 'lodash'
import { app, contextBridge, ipcRenderer } from 'electron'
import {
    IPC_APP_CHANNEL,
    IPC_SETTING_CHANNEL,
    IPC_DIARY_CHANNEL,
    IPC_TODO_CHANNEL,
    IPC_CRAWLER_CHANNEL,
} from '@/constants/ipc'
import type { IPCRequest } from '@/types/ipc'
const send = (channel: string) => ipcRenderer.send(channel)
const sendSync = (channel: string) => {
    return new Promise((resolve) => {
        ipcRenderer.on(channel, (event, response) => resolve(response))
    })
}
const invoke = async (channel: string, payload?: any) => {
    return new Promise((resolve, reject) => {
        ipcRenderer
            .invoke(channel, payload)
            .then((response) => {
                // 결과가 false 이면 응답을 에러로 처리
                if (_.isPlainObject(response) && response.result == false) {
                    reject(response)
                    return
                }
                resolve(response)
            })
            // 일렉트론에서 뱉은 에러는 렌더러에서 출력하지 않도록 함
            .catch((e) => e)
    })
}
contextBridge.exposeInMainWorld('$native', {
    getVersion() {
        return app.getVersion()
    },
    updater: {},
    app: {
        exit() {
            send(IPC_APP_CHANNEL.EXIT)
        },
        install() {
            send(IPC_APP_CHANNEL.INSTALL_UPDATE)
        },
        // 업데이트 가능여부가 확인될 때 까지 기다림
        waitAvailableUpdate() {
            return sendSync(IPC_APP_CHANNEL.AVAILABLE_UPDATE)
        },
        availableUpdate() {
            return invoke(IPC_APP_CHANNEL.AVAILABLE_UPDATE)
        },
    },
    setting: {
        loadPasscode(payload: IPCRequest.Setting.ILoadPasscode) {
            return invoke(IPC_SETTING_CHANNEL.LOAD_PASSCODE, payload)
        },
        updatePasscode(payload: IPCRequest.Setting.IUpdatePasscode) {
            return invoke(IPC_SETTING_CHANNEL.UPDATE_PASSCODE, payload)
        },
        verifyPasscode(payload: IPCRequest.Setting.IVerifyPasscode) {
            return invoke(IPC_SETTING_CHANNEL.VERIFY_PASSCODE, payload)
        },
        activatePasscode(payload: IPCRequest.Setting.IActivatePasscode) {
            return invoke(IPC_SETTING_CHANNEL.ACTIVATE_PASSCODE, payload)
        },
        loadOverlayVideos() {
            return invoke(IPC_SETTING_CHANNEL.LOAD_OVERLAY_VIDEOS)
        },
        updateOverlayVideo() {
            return invoke(IPC_SETTING_CHANNEL.UPDATE_OVERLOAY_VIDEO)
        },
    },
    diary: {
        openDir() {
            send(IPC_DIARY_CHANNEL.OPEN_DIR)
        },
        load() {
            return invoke(IPC_DIARY_CHANNEL.LOAD)
        },
        read(payload: IPCRequest.Diary.IRead) {
            return invoke(IPC_DIARY_CHANNEL.READ, payload)
        },
        write(payload: IPCRequest.Diary.IWrite) {
            return invoke(IPC_DIARY_CHANNEL.WRITE, payload)
        },
        writeDir(payload: IPCRequest.Diary.IWriteDir) {
            return invoke(IPC_DIARY_CHANNEL.WRITE_DIR, payload)
        },
        delete(payload: IPCRequest.Diary.IDelete) {
            return invoke(IPC_DIARY_CHANNEL.DELETE, payload)
        },
        rename(payload: IPCRequest.Diary.IRename) {
            return invoke(IPC_DIARY_CHANNEL.RENAME, payload)
        },
        move(payload: IPCRequest.Diary.IMove) {
            return invoke(IPC_DIARY_CHANNEL.MOVE, payload)
        },
    },
    todo: {
        load() {
            return invoke(IPC_TODO_CHANNEL.LOAD)
        },
        save(payload: IPCRequest.Todo.ISave) {
            return invoke(IPC_TODO_CHANNEL.SAVE, payload)
        },
        delete(payload: IPCRequest.Todo.IDelete) {
            return invoke(IPC_TODO_CHANNEL.DELETE, payload)
        },
        loadSprint(payload: IPCRequest.Todo.ILoadSprint) {
            return invoke(IPC_TODO_CHANNEL.LOAD_SPRINT, payload)
        },
        deleteSprint(payload: IPCRequest.Todo.IDeleteSprint) {
            return invoke(IPC_TODO_CHANNEL.DELETE_SPRINT, payload)
        },
    },
    crawler: {
        loadWorkers(payload: IPCRequest.Crawler.ILoadWorkers) {
            return invoke(IPC_CRAWLER_CHANNEL.LOAD_WORKERS, payload)
        },
        saveWorker(payload: IPCRequest.Crawler.ISaveWorker) {
            return invoke(IPC_CRAWLER_CHANNEL.SAVE_WORKER, payload)
        },
        saveWorkerLabel(payload: IPCRequest.Crawler.ISaveWorkerLabel) {
            return invoke(IPC_CRAWLER_CHANNEL.SAVE_WORKER_LABEL, payload)
        },
        deleteWorker(payload: IPCRequest.Crawler.IDeleteWorker) {
            return invoke(IPC_CRAWLER_CHANNEL.DELETE_WORKER, payload)
        },
        scrapingSelector(payload: IPCRequest.Crawler.IScrapingSelector) {
            return invoke(IPC_CRAWLER_CHANNEL.SCRAPING_SELECTOR, payload)
        },
    },
})
