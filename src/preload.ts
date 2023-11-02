import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('$native', {
    getVersion() {
        return 1
    },
    category: {
        get() {
            return ipcRenderer.invoke('category:get')
        },
        set(payload: Category) {
            return ipcRenderer.invoke('category:set', payload)
        },
    },
    markdown: {
        get() {
            return ipcRenderer.invoke('markdown:get')
        },
        getFiles() {
            return ipcRenderer.invoke('markdown:files')
        },
    },
})
