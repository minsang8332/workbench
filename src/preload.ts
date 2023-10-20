import { contextBridge } from 'electron'
contextBridge.exposeInMainWorld('$electron', {
    getVersion() {
        return 1
    },
})
