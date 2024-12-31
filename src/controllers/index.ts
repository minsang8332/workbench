import { ipcMain, app } from 'electron'
import '@/services/protocol'
import '@/controllers/updater'
import '@/controllers/diary'
import '@/controllers/todo'
import { IPC_APP } from '@/constants/ipc'
ipcMain.on(IPC_APP.EXIT, () => app.quit())
