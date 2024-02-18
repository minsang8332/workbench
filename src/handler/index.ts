import { ipcMain, app } from 'electron'
import '@/tools/protocol'
import '@/handler/updater'
import '@/handler/diary'
import '@/handler/receipt'
ipcMain.on('exit', () => app.quit())
