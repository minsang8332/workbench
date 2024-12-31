import _ from 'lodash'
import { Todo } from '@/models/todo'
import Store from '@/services/store'
import ipcService from '@/services/ipc'
import { IPC_TODO } from '@/constants/ipc'
// 작업 관리 목록
ipcService.controller(IPC_TODO.LOAD, (request: IpcController.IRequest.Empty, response: IpcController.IResponse) => {
    const store = new Store<ITodo>(Todo.IDENTIFIER)
    const todos = store.get()
    response.data = {
        todos,
    }
    return response
})
// 작업 생성 및 수정
ipcService.controller(
    IPC_TODO.SAVE,
    (request: IpcController.IRequest.Todo.ISave, response: IpcController.IResponse) => {
        const store = new Store<ITodo>(Todo.IDENTIFIER)
        const todo = new Todo(request)
        const id = request.id ? store.update(todo) : store.insert(todo)
        response.data = {
            id,
        }
        return response
    }
)
// 작업 제거
ipcService.controller(
    IPC_TODO.REMOVE,
    (request: IpcController.IRequest.Todo.IRemove, response: IpcController.IResponse) => {
        const store = new Store<ITodo>(Todo.IDENTIFIER)
        const todo = store.remove(request.id)
        if (!(todo && todo.id)) {
            throw new Error('대상을 찾을 수 없습니다.')
        }
        response.data = {
            id: todo.id,
        }
        return response
    }
)
