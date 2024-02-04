import { app, contextBridge, ipcRenderer } from 'electron'
const invoke = async (channel: string, payload: object) => {
    const response = await ipcRenderer.invoke(channel, payload).catch((e) => e)
    if (response && response.error) {
        throw response.error
    }
    return response
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
    markdown: {
        readAll(payload: object) {
            return invoke('markdown:read-all', payload)
        },
        read(payload: object) {
            return invoke('markdown:read', payload)
        },
        write(payload: object) {
            return invoke('markdown:write', payload)
        },
        openDir() {
            ipcRenderer.send('markdown:open-dir')
        },
        writeDir(payload: object) {
            return invoke('markdown:write-dir', payload)
        },
        remove(payload: object) {
            return invoke('markdown:remove', payload)
        },
        rename(payload: object) {
            return invoke('markdown:rename', payload)
        },
        move(payload: object) {
            return invoke('markdown:move', payload)
        },
    },
    accountBook: {
        read(payload: IpcPayload.AccountBook.IRead) {
            return invoke('account-book:read', payload)
        },
        save(payload: IpcPayload.AccountBook.ISave) {
            return invoke('account-book:save', payload)
        },
        remove(payload: IpcPayload.AccountBook.IRemove) {
            return invoke('account-book:remove', payload)
        },
    },
})
