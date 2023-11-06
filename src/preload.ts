import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('$native', {
    getVersion() {
        return 1
    },
    markdown: {
        read(payload: object) {
            return ipcRenderer.invoke('markdown:read', payload)
        },
        write(payload: object) {
            return ipcRenderer.invoke('markdown:write', payload)
        },
        remove(payload: object) {
            return ipcRenderer.invoke('markdown:remove', payload)
        },
    },
})
