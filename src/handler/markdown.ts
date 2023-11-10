import _ from 'lodash'
import { ipcMain, shell } from 'electron'
import fsTool from '@/tools/fs'
import handlerTool from '@/tools/handler'
const rootDir = fsTool.getMdDir()
fsTool.ensureDir(rootDir)
// 문서함 열기
ipcMain.on('markdown:open-dir', () => shell.openPath(rootDir))
// 모든 문서 목록
ipcMain.handle('markdown:read-all', async () => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const markdowns: Markdown[] = await fsTool.readTreeDirs(rootDir)
        response.data = {
            markdowns,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle('markdown:read', async (event, { target } = {}) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const text = await fsTool.readFile(target, { rootDir })
        response.data = {
            text: _.toString(text),
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
/** @Handle 문서 생성 (data: 내용 path: 상대경로, ext: 확장자명) */
ipcMain.handle(
    'markdown:write',
    async (event, { target, text = '', ext = 'md' } = {}) => {
        let response: IHandlerResponse = handlerTool.createResponse()
        try {
            const writed = await fsTool.writeFile(target, {
                text,
                ext,
                rootDir,
            })
            response.data = {
                writed,
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
// 문서 경로 추가
ipcMain.handle(
    'markdown:write-dir',
    async (event, { target, dirname } = {}) => {
        let response: IHandlerResponse = handlerTool.createResponse()
        try {
            const writed = await fsTool.writeDir(target, { dirname, rootDir })
            response.data = {
                writed,
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
// 문서 삭제
ipcMain.handle('markdown:remove', async (event, { target } = {}) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const removed = await fsTool.remove(target, { rootDir })
        response.data = {
            removed,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서명 변경
ipcMain.handle('markdown:rename', async (event, { target, rename } = {}) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const renamed = await fsTool.rename(target, rename, { rootDir })
        response.data = {
            renamed,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서 이동
ipcMain.handle('markdown:move', async (event, { target, dest } = {}) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const moved = await fsTool.move(target, dest, { rootDir })
        response.data = {
            moved,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
