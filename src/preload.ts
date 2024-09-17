import { app, contextBridge, ipcRenderer } from 'electron'
const invoke = async (channel: string, payload?: any) => {
    const response = await ipcRenderer.invoke(channel, payload).catch((e) => e)
    if (response && response.error) {
        throw response.error
    }
    return response
}
const diary = {
    readAll() {
        return invoke('diary:read-all')
    },
    read(payload: IpcPayload.Diary.IRead) {
        return invoke('diary:read', payload)
    },
    write(payload: IpcPayload.Diary.IWrite) {
        return invoke('diary:write', payload)
    },
    openDir() {
        ipcRenderer.send('diary:open-dir')
    },
    writeDir(payload: IpcPayload.Diary.IWriteDir) {
        return invoke('diary:write-dir', payload)
    },
    remove(payload: IpcPayload.Diary.IRemove) {
        return invoke('diary:remove', payload)
    },
    rename(payload: IpcPayload.Diary.IRename) {
        return invoke('diary:rename', payload)
    },
    move(payload: IpcPayload.Diary.IMove) {
        return invoke('diary:move', payload)
    },
}
contextBridge.exposeInMainWorld('$native', {
    exit() {
        ipcRenderer.send('exit')
    },
    getVersion() {
        return app.getVersion()
    },
    updater: {
        // 업데이트 가능여부가 확인뙬 때 까지 기다림
        wait() {
            return new Promise((resolve) => {
                ipcRenderer.on('updater:available', (event, payload) =>
                    resolve(payload)
                )
            })
        },
        available(payload = {}) {
            return invoke('updater:available', payload)
        },
        install() {
            ipcRenderer.send('updater:install')
        },
    },
    diary,
    /** @memo v1.0.0 에서는 [ markdown ] 으로 사용중. */
    markdown: diary,
    todo: {
        readAll() {
            return invoke('todo:read-all')
        },
        save(payload: IpcPayload.Todo.ISave) {
            return invoke('todo:save', payload)
        },
        remove(payload: IpcPayload.Todo.IRemove) {
            return invoke('todo:remove', payload)
        },
    },
})
