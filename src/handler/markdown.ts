import _ from 'lodash'
import { ipcMain } from 'electron'
import fsTool from '@/tools/fs'
const rootDir = fsTool.getMdDir()
fsTool.ensureDir(rootDir)
ipcMain.handle('markdown:read', () => fsTool.readDirs(rootDir))
ipcMain.handle(
    'markdown:write',
    (event, { data = '', path = '/', filename, ext = '.md' } = {}) => {
        fsTool.writeFile(path, { data, filename, ext, rootDir })
    }
)
ipcMain.handle('markdown:remove', (event, { path = '/' } = {}) => {
    fsTool.removeFile(path, { rootDir })
})
