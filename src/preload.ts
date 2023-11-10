import { contextBridge, ipcRenderer } from 'electron'
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
        return 1
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
})
