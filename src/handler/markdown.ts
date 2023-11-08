import _ from 'lodash'
import { ipcMain, shell } from 'electron'
import dayjs from 'dayjs'
import fsTool from '@/tools/fs'
const rootDir = fsTool.getMdDir()
fsTool.ensureDir(rootDir)
ipcMain.handle('markdown:read-all', async () => {
    let dirs: Markdown[] = []
    try {
        dirs = await fsTool.readDirsTree(rootDir)
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
    return { data }
})
/** @Handle 문서 생성 (data: 내용 path: 상대경로, ext: 확장자명) */
ipcMain.handle(
    'markdown:write',
    (event, { data = '', path = '/', ext = 'md' } = {}) => {
        const writed = fsTool.writeFile(path, {
            data,
            ext,
            rootDir,
            overwrite: true,
        })
        return {
            writed,
        }
    }
)
// 문서 경로 추가
ipcMain.handle('markdown:write-dir', (event, { path = '/', dirname } = {}) => {
    const writed = fsTool.writeDir(path, { dirname, rootDir })
    return {
        writed,
    }
})
// 문서 삭제
ipcMain.handle('markdown:remove', async (event, { path = '/' } = {}) => {
    try {
        await fsTool.remove(path, { rootDir })
    } catch (e) {
        console.error(e)
    }
})
// 문서명 변경
ipcMain.handle('markdown:rename', (event, { path = '/', name } = {}) => {
    const renamed = fsTool.rename(path, { name, rootDir })
    return {
        renamed,
    }
})
// 문서함 열기
ipcMain.on('markdown:open-dir', () => shell.openPath(rootDir))
