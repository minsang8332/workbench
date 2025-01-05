import _ from 'lodash'
import { controller } from '@/utils/ipc'
import { Todo } from '@/models/todo'
import { IPC_TODO } from '@/constants/ipc'
import TodoRepository from '@/repositories/todo-repository'
// 작업 관리 목록
controller(IPC_TODO.LOAD, (request: IpcController.Request.Todo.ILoad, response: IpcController.IResponse) => {
    const todoRepository = new TodoRepository()
    const todos = todoRepository.findAll()
    response.data.todos = todos
    response.result = true
    return response
})
// 작업 생성 및 수정
controller(IPC_TODO.SAVE, (request: IpcController.Request.Todo.ISave, response: IpcController.IResponse) => {
    const todoRepository = new TodoRepository()
    const todo = new Todo(request)
    const id = request.id ? todoRepository.update(todo) : todoRepository.insert(todo)
    response.data.id = id
    response.result = true
    return response
})
// 작업 제거
controller(IPC_TODO.REMOVE, (request: IpcController.Request.Todo.IRemove, response: IpcController.IResponse) => {
    const todoRepository = new TodoRepository()
    response.result = todoRepository.remove(request.id)
    return response
})
