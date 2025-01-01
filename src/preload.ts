import { app, contextBridge, ipcRenderer } from 'electron'
import { IPC_APP, IPC_UPDATER, IPC_SETTING, IPC_DIARY, IPC_TODO } from '@/constants/ipc'
const send = (channel: string) => ipcRenderer.send(channel)
const sendSync = (channel: string) => {
    return new Promise((resolve) => {
        ipcRenderer.on(channel, (event, response) => resolve(response))
    })
}
const invoke = async (channel: string, payload?: any) => {
    // electron 내부 에러는 불필요 메시지를 포함하여 보내기에 예외처리 하고 ...
    const response = await ipcRenderer.invoke(channel, payload).catch((e) => e)
    // 내가 보낸 response.error 만 강제로 예외 발생시킴
    if (response && response.error) {
        throw response.error
    }
    return response
}
contextBridge.exposeInMainWorld('$native', {
    exit() {
        send(IPC_APP.EXIT)
    },
    getVersion() {
        return app.getVersion()
    },
    updater: {
        install() {
            send(IPC_UPDATER.INSTALL)
        },
        available() {
            return invoke(IPC_UPDATER.AVAILABLE)
        },
        // 업데이트 가능여부가 확인될 때 까지 기다림
        wait() {
            return sendSync(IPC_UPDATER.AVAILABLE)
        },
    },
    setting: {
        loadPasscode(payload: IpcController.Request.Setting.ILoadPasscode) {
            return invoke(IPC_SETTING.LOAD_PASSCODE, payload)
        },
        updatePasscode(payload: IpcController.Request.Setting.IUpdatePasscode) {
            return invoke(IPC_SETTING.UPDATE_PASSCODE, payload)
        },
        verifyPasscode(payload: IpcController.Request.Setting.IVerifyPasscode) {
            return invoke(IPC_SETTING.VERIFY_PASSCODE, payload)
        },
        activatePasscode(payload: IpcController.Request.Setting.IActivatePasscode) {
            return invoke(IPC_SETTING.ACTIVATE_PASSCODE, payload)
        },
    },
    diary: {
        openDir() {
            send(IPC_DIARY.OPEN_DIR)
        },
        load() {
            return invoke(IPC_DIARY.LOAD)
        },
        read(payload: IpcController.Request.Diary.IRead) {
            return invoke(IPC_DIARY.READ, payload)
        },
        write(payload: IpcController.Request.Diary.IWrite) {
            return invoke(IPC_DIARY.WRITE, payload)
        },
        writeDir(payload: IpcController.Request.Diary.IWriteDir) {
            return invoke(IPC_DIARY.WRITE_DIR, payload)
        },
        remove(payload: IpcController.Request.Diary.IRemove) {
            return invoke(IPC_DIARY.REMOVE, payload)
        },
        rename(payload: IpcController.Request.Diary.IRename) {
            return invoke(IPC_DIARY.RENAME, payload)
        },
        move(payload: IpcController.Request.Diary.IMove) {
            return invoke(IPC_DIARY.MOVE, payload)
        },
    },
    todo: {
        load() {
            return invoke(IPC_TODO.LOAD)
        },
        save(payload: IpcController.Request.Todo.ISave) {
            return invoke(IPC_TODO.SAVE, payload)
        },
        remove(payload: IpcController.Request.Todo.IRemove) {
            return invoke(IPC_TODO.REMOVE, payload)
        },
    },
})
