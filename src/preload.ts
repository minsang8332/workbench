import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('$native', {
    getVersion() {
        return 1
    },
    markdown: {
        findAll() {
            return ipcRenderer.invoke('markdown:findAll')
        },
    },
})
