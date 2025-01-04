import _ from 'lodash'
import Store from '@/models/store'
import { controller } from '@/utils/ipc'
import { Todo } from '@/models/todo'
import { IPC_TODO } from '@/constants/ipc'
// 작업 관리 목록
controller(IPC_TODO.LOAD, (request: IpcController.Request.Todo.ILoad, response: IpcController.IResponse) => {
    const store = new Store<ITodo>(Todo.IDENTIFIER)
    const todos = store.get()
    response.data.todos = todos
    response.result = true
    return response
})
// 작업 생성 및 수정
controller(IPC_TODO.SAVE, (request: IpcController.Request.Todo.ISave, response: IpcController.IResponse) => {
    const store = new Store<ITodo>(Todo.IDENTIFIER)
    const todo = new Todo(request)
    const id = request.id ? store.update(todo) : store.insert(todo)
    response.data.id = id
    response.result = true
    return response
})
// 작업 제거
controller(IPC_TODO.REMOVE, (request: IpcController.Request.Todo.IRemove, response: IpcController.IResponse) => {
    const store = new Store<ITodo>(Todo.IDENTIFIER)
    const todo = store.remove(request.id)
    if (!(todo && todo.id)) {
        throw new Error('대상을 찾을 수 없습니다.')
    }
    response.data.id = todo.id
    response.result = true
    return response
})
