import { app, contextBridge, ipcRenderer } from 'electron'
const invoke = async (channel: string, payload?: any) => {
    const response = await ipcRenderer.invoke(channel, payload).catch((e) => e)
    if (response && response.error) {
        throw response.error
    }
    return response
}
const document = {
    readAll() {
        return invoke('document:read-all')
    },
    read(payload: IpcPayload.Document.IRead) {
        return invoke('document:read', payload)
    },
    write(payload: IpcPayload.Document.IWrite) {
        return invoke('document:write', payload)
    },
    openDir() {
        ipcRenderer.send('document:open-dir')
    },
    writeDir(payload: IpcPayload.Document.IWriteDir) {
        return invoke('document:write-dir', payload)
    },
    remove(payload: IpcPayload.Document.IRemove) {
        return invoke('document:remove', payload)
    },
    rename(payload: IpcPayload.Document.IRename) {
        return invoke('document:rename', payload)
    },
    move(payload: IpcPayload.Document.IMove) {
        return invoke('document:move', payload)
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
    document,
    /** @memo v1.0.0 에서는 [ markdown ] 으로 사용중. */
    markdown: document,
    receipt: {
        read(payload: IpcPayload.Receipt.IRead) {
            return invoke('receipt:read', payload)
        },
        save(payload: IpcPayload.Receipt.ISave) {
            return invoke('receipt:save', payload)
        },
        remove(payload: IpcPayload.Receipt.IRemove) {
            return invoke('receipt:remove', payload)
        },
    },
})
