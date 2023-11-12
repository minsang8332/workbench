import { ipcMain, app } from 'electron'
import '@/tools/protocol'
import '@/handler/updater'
import '@/handler/markdown'
ipcMain.on('exit', () => app.quit())
