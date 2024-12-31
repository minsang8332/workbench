import { app, contextBridge, ipcRenderer } from 'electron'
import { IPC_APP, IPC_UPDATER, IPC_SETTING, IPC_DIARY, IPC_TODO } from '@/constants/ipc'
const invoke = async (channel: string, payload?: any) => {
    const response = await ipcRenderer.invoke(channel, payload).catch((e) => e)
    if (response && response.error) {
        throw response.error
    }
    return response
}
contextBridge.exposeInMainWorld('$native', {
    exit() {
        ipcRenderer.send(IPC_APP.EXIT)
    },
    getVersion() {
        return app.getVersion()
    },
    updater: {
        install() {
            ipcRenderer.send(IPC_UPDATER.INSTALL)
        },
        available() {
            return invoke(IPC_UPDATER.AVAILABLE)
        },
        // 업데이트 가능여부가 확인뙬 때 까지 기다림
        wait() {
            return new Promise((resolve) => {
                ipcRenderer.on(IPC_UPDATER.AVAILABLE, (event, payload) => resolve(payload))
            })
        },
    },
    setting: {
        updatePasscode(payload: IpcController.IRequest.Setting.IUpdatePasscode) {
            return invoke(IPC_SETTING.UPDATE_PASSCODE, payload)
        },
        verifyPasscode(payload: IpcController.IRequest.Setting.IVerifyPasscode) {
            return invoke(IPC_SETTING.VERIFY_PASSCODE, payload)
        },
    },
    diary: {
        openDir() {
            ipcRenderer.send(IPC_DIARY.OPEN_DIR)
        },
        load() {
            return invoke(IPC_DIARY.LOAD)
        },
        read(payload: IpcController.IRequest.Diary.IRead) {
            return invoke(IPC_DIARY.READ, payload)
        },
        write(payload: IpcController.IRequest.Diary.IWrite) {
            return invoke(IPC_DIARY.WRITE, payload)
        },
        writeDir(payload: IpcController.IRequest.Diary.IWriteDir) {
            return invoke(IPC_DIARY.WRITE_DIR, payload)
        },
        remove(payload: IpcController.IRequest.Diary.IRemove) {
            return invoke(IPC_DIARY.REMOVE, payload)
        },
        rename(payload: IpcController.IRequest.Diary.IRename) {
            return invoke(IPC_DIARY.RENAME, payload)
        },
        move(payload: IpcController.IRequest.Diary.IMove) {
            return invoke(IPC_DIARY.MOVE, payload)
        },
    },
    todo: {
        load() {
            return invoke(IPC_TODO.LOAD)
        },
        save(payload: IpcController.IRequest.Todo.ISave) {
            return invoke(IPC_TODO.SAVE, payload)
        },
        remove(payload: IpcController.IRequest.Todo.IRemove) {
            return invoke(IPC_TODO.REMOVE, payload)
        },
    },
})
