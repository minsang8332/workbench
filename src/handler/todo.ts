import _ from 'lodash'
import { ipcMain } from 'electron'
import handlerTool from '@/tools/handler'
// 작업 관리 목록
ipcMain.handle('todo:read', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 작업 생성 및 수정
ipcMain.handle('todo:save', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 작업 제거
ipcMain.handle('todo:remove', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
