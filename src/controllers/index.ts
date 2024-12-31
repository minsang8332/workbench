import { ipcMain, app } from 'electron'
import '@/utils/protocol'
import '@/controllers/updater'
import '@/controllers/diary'
import '@/controllers/todo'
import '@/controllers/setting'
import { IPC_APP } from '@/constants/ipc'
ipcMain.on(IPC_APP.EXIT, () => app.quit())
