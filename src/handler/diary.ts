import _ from 'lodash'
import path from 'path'
import { ipcMain, shell } from 'electron'
import fsTool from '@/tools/fs'
import handlerTool from '@/tools/handler'
const rootDir = path.resolve(fsTool.getDocsDir(), 'diary')
fsTool.ensureDir(rootDir)
// 문서함 열기
ipcMain.on('diary:open-dir', () => shell.openPath(rootDir))
// 모든 문서 목록
ipcMain.handle('diary:read-all', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        const diaries: IDiary[] = await fsTool.readTreeDirs(rootDir)
        response.data = {
            diaries,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle(
    'diary:read',
    async (event, { target }: IpcPayload.Diary.IRead) => {
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
ipcMain.handle(
    'diary:write',
    async (
        event,
        { target, text = '', ext = 'md' }: IpcPayload.Diary.IWrite
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
    'diary:write-dir',
    async (event, { target, dirname }: IpcPayload.Diary.IWriteDir) => {
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
    'diary:remove',
    async (event, { target }: IpcPayload.Diary.IRemove) => {
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
    'diary:rename',
    async (event, payload: IpcPayload.Diary.IRename) => {
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
ipcMain.handle('diary:move', async (event, payload: IpcPayload.Diary.IMove) => {
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
})
