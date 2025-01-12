import _ from 'lodash'
import { app, contextBridge, ipcRenderer } from 'electron'
import { IPC_APP, IPC_SETTING, IPC_DIARY, IPC_TODO } from '@/constants/ipc'
import type { IPCRequest } from '@/types/ipc'
const send = (channel: string) => ipcRenderer.send(channel)
const sendSync = (channel: string) => {
    return new Promise((resolve) => {
        ipcRenderer.on(channel, (event, response) => resolve(response))
    })
}
const invoke = async (channel: string, payload?: any) => {
    // 일렉트론에서 뱉은 에러는 렌더러에서 출력하지 않도록 함
    const response = await ipcRenderer.invoke(channel, payload).catch((e) => e)
    // 결과가 false 이면 응답을 에러로 처리
    if (_.isPlainObject(response) && response.result == false) {
        throw response
    }
    return response
}
contextBridge.exposeInMainWorld('$native', {
    getVersion() {
        return app.getVersion()
    },
    updater: {},
    app: {
        exit() {
            send(IPC_APP.EXIT)
        },
        install() {
            send(IPC_APP.INSTALL_UPDATE)
        },
        // 업데이트 가능여부가 확인될 때 까지 기다림
        waitAvailableUpdate() {
            return sendSync(IPC_APP.AVAILABLE_UPDATE)
        },
        availableUpdate() {
            return invoke(IPC_APP.AVAILABLE_UPDATE)
        },
    },
    setting: {
        loadPasscode(payload: IPCRequest.Setting.ILoadPasscode) {
            return invoke(IPC_SETTING.LOAD_PASSCODE, payload)
        },
        updatePasscode(payload: IPCRequest.Setting.IUpdatePasscode) {
            return invoke(IPC_SETTING.UPDATE_PASSCODE, payload)
        },
        verifyPasscode(payload: IPCRequest.Setting.IVerifyPasscode) {
            return invoke(IPC_SETTING.VERIFY_PASSCODE, payload)
        },
        activatePasscode(payload: IPCRequest.Setting.IActivatePasscode) {
            return invoke(IPC_SETTING.ACTIVATE_PASSCODE, payload)
        },
        loadOverlayVideos() {
            return invoke(IPC_SETTING.LOAD_OVERLAY_VIDEOS)
        },
        updateOverlayVideo() {
            return invoke(IPC_SETTING.UPDATE_OVERLOAY_VIDEO)
        },
    },
    diary: {
        openDir() {
            send(IPC_DIARY.OPEN_DIR)
        },
        load() {
            return invoke(IPC_DIARY.LOAD)
        },
        read(payload: IPCRequest.Diary.IRead) {
            return invoke(IPC_DIARY.READ, payload)
        },
        write(payload: IPCRequest.Diary.IWrite) {
            return invoke(IPC_DIARY.WRITE, payload)
        },
        writeDir(payload: IPCRequest.Diary.IWriteDir) {
            return invoke(IPC_DIARY.WRITE_DIR, payload)
        },
        remove(payload: IPCRequest.Diary.IRemove) {
            return invoke(IPC_DIARY.REMOVE, payload)
        },
        rename(payload: IPCRequest.Diary.IRename) {
            return invoke(IPC_DIARY.RENAME, payload)
        },
        move(payload: IPCRequest.Diary.IMove) {
            return invoke(IPC_DIARY.MOVE, payload)
        },
    },
    todo: {
        load() {
            return invoke(IPC_TODO.LOAD)
        },
        save(payload: IPCRequest.Todo.ISave) {
            return invoke(IPC_TODO.SAVE, payload)
        },
        delete(payload: IPCRequest.Todo.IDelete) {
            return invoke(IPC_TODO.DELETE, payload)
        },
        loadSprint(payload: IPCRequest.Todo.ILoadSprint) {
            return invoke(IPC_TODO.LOAD_SPRINT, payload)
        },
        deleteSprint(payload: IPCRequest.Todo.IDeleteSprint) {
            return invoke(IPC_TODO.DELETE_SPRINT, payload)
        },
    },
})
