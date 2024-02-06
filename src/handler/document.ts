import _ from 'lodash'
import path from 'path'
import { ipcMain, shell } from 'electron'
import fsTool from '@/tools/fs'
import handlerTool from '@/tools/handler'
const rootDir = path.resolve(fsTool.getDocsDir(), 'markdown')
fsTool.ensureDir(rootDir)
// 문서함 열기
ipcMain.on('document:open-dir', () => shell.openPath(rootDir))
// 모든 문서 목록
ipcMain.handle('document:read-all', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        const markdowns: IDocument[] = await fsTool.readTreeDirs(rootDir)
        response.data = {
            markdowns,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle(
    'document:read',
    async (event, { target }: IpcPayload.Document.IRead) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const text = await fsTool.readFile(target, { rootDir })
            response.data = {
                text: _.toString(text),
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
/** @Handle 문서 생성 (data: 내용 path: 상대경로, ext: 확장자명) */
ipcMain.handle(
    'document:write',
    async (
        event,
        { target, text = '', ext = 'md' }: IpcPayload.Document.IWrite
    ) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
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
    'document:write-dir',
    async (event, { target, dirname }: IpcPayload.Document.IWriteDir) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
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
ipcMain.handle(
    'document:remove',
    async (event, { target }: IpcPayload.Document.IRemove) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const removed = await fsTool.remove(target, { rootDir })
            response.data = {
                removed,
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
// 문서명 변경
ipcMain.handle(
    'document:rename',
    async (event, payload: IpcPayload.Document.IRename) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const { target, rename } = payload
            const renamed = await fsTool.rename(target, rename, { rootDir })
            response.data = {
                renamed,
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
// 문서 이동
ipcMain.handle(
    'document:move',
    async (event, payload: IpcPayload.Document.IMove) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const { target, dest } = payload
            const moved = await fsTool.move(target, dest, { rootDir })
            response.data = {
                moved,
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
