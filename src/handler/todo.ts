import _ from 'lodash'
import { ipcMain } from 'electron'
import { Todo } from '@/models/todo'
import Store from '@/tools/store'
import handlerTool from '@/tools/handler'
// 작업 관리 목록
ipcMain.handle('todo:read', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        const store = new Store('todo')
        const items = store.get() ?? []
        response.data = {
            items
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 작업 생성 및 수정
ipcMain.handle(
    'todo:save',
    (event, payload: IpcPayload.Todo.ISave) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const store = new Store('todo')
            const todo = new Todo(payload)
            const id = payload.id ? store.update(todo) : store.insert(todo)
            console.log(id)
            response.data = {
                id
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
// 작업 제거
ipcMain.handle(
    'todo:remove', 
    (event, payload: IpcPayload.Todo.IRemove) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const store = new Store('todo')
            const todo = store.remove(payload.id)
            if (!(todo && todo.id)) {
                throw new Error('대상을 찾을 수 없습니다.')
            }
            response.data = {
                id: todo.id
            }
        } catch (e) {
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
