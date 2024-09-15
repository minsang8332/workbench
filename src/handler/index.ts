import { ipcMain, app } from 'electron'
import '@/tools/protocol'
import '@/handler/updater'
import '@/handler/diary'
ipcMain.on('exit', () => app.quit())
