import { ipcMain, app } from 'electron'
import '@/tools/protocol'
import '@/handler/updater'
import '@/handler/diary'
import '@/handler/todo'
ipcMain.on('exit', () => app.quit())
