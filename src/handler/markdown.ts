import _ from 'lodash'
import { ipcMain, shell } from 'electron'
import dayjs from 'dayjs'
import fsTool from '@/tools/fs'
const rootDir = fsTool.getMdDir()
fsTool.ensureDir(rootDir)
ipcMain.handle('markdown:read-all', async () => {
    let dirs: Markdown[] = []
    try {
        dirs = await fsTool.readDirs(rootDir)
    } catch (e) {
        console.error(e)
    }
    return dirs
})
ipcMain.handle('markdown:read', async (event, { path = '/' } = {}) => {
    let data = null
    try {
        data = await fsTool.readFile(path, { rootDir })
        data = _.toString(data)
    } catch (e) {
        console.error(e)
    }
    return data
})
/**
 * @Handler 문서 저장
 * filename: 파일명, data: 내용 path: 상대경로, ext: 확장자명
 */
ipcMain.handle(
    'markdown:write',
    (event, { data = '', path = '/', ext = '.md' } = {}) => {
        fsTool.writeFile(path, { data, ext, rootDir, overwrite: true })
    }
)
ipcMain.handle(
    'markdown:write-dir',
    (event, { data = '', path = '/', dirname } = {}) => {
        if (_.isNil(dirname)) {
            dirname = `새폴더_${dayjs().format('YYYYMMDDHHmmss')}`
        }
        fsTool.writeDir(path, { dirname, rootDir })
    }
)
// 문서 삭제
ipcMain.handle('markdown:remove', (event, { path = '/' } = {}) => {
    fsTool.removeFile(path, { rootDir })
})
// 문서함 열기
ipcMain.on('markdown:open-dir', () => shell.openPath(rootDir))
