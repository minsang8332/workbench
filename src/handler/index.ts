import { ipcMain, app } from 'electron'
import '@/handler/markdown'
ipcMain.on('exit', () => app.quit())
