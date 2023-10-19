import fs from 'fs'
import { ipcMain } from 'electron'
interface Markdown {}
ipcMain.on('markdown:findAll', (): Markdown[] => {
    let mds: Markdown[] = []
    return mds
})
ipcMain.on('markdown:findOne', (): Markdown | null => {
    let md = null
    return md
})
ipcMain.on('markdown:edit', (): boolean => {
    return false
})
ipcMain.on('markdown:delete', (_, fileName: String): boolean => {
    return false
})
