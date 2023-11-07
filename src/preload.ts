import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('$native', {
    exit() {
        ipcRenderer.send('exit')
    },
    getVersion() {
        return 1
    },
    markdown: {
        readAll(payload: object) {
            return ipcRenderer.invoke('markdown:read-all', payload)
        },
        read(payload: object) {
            return ipcRenderer.invoke('markdown:read', payload)
        },
        write(payload: object) {
            return ipcRenderer.invoke('markdown:write', payload)
        },
        writeDir(payload: object) {
            return ipcRenderer.invoke('markdown:write-dir', payload)
        },
        remove(payload: object) {
            return ipcRenderer.invoke('markdown:remove', payload)
        },
        openDir() {
            ipcRenderer.send('markdown:open-dir')
        },
    },
})
