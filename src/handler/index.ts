import { ipcMain, app } from 'electron'
import '@/tools/protocol'
import '@/handler/updater'
import '@/handler/markdown'
import '@/handler/account-book'
ipcMain.on('exit', () => app.quit())
