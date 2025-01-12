import _ from 'lodash'
import { controller } from '@/utils/ipc'
import { IPC_TODO_CHANNEL } from '@/constants/ipc'
import TodoRepository from '@/repositories/TodoRepository'
import TodoSprintRepository from '@/repositories/TodoSprintRepository'
import TodoService from '@/services/TodoService'
import Todo from '@/models/Todo'
import type { ITodoSprint } from '@/types/model'
import type { IPCRequest, IPCResponse } from '@/types/ipc'
// 해야 할 일 목록
controller(IPC_TODO_CHANNEL.LOAD, (request: IPCRequest.Todo.ILoad, response: IPCResponse.IBase) => {
    const todoRepository = new TodoRepository()
    const todos = todoRepository.findAll()
    response.data.todos = todos
    return response
})
// 해야 할 일 편집
controller(IPC_TODO_CHANNEL.SAVE, (request: IPCRequest.Todo.ISave, response: IPCResponse.IBase) => {
    const todoService = new TodoService()
    const todoRepository = new TodoRepository()
    const todo = new Todo(request)
    const id = request.id ? todoRepository.update(todo) : todoRepository.insert(todo)
    // 스프린트 일괄 처리
    if (id && _.isArray(request.sprints)) {
        todoService.batchSprints(id, <ITodoSprint[]>request.sprints)
    }
    response.data.id = id
    return response
})
// 해야 할 일 제거
controller(IPC_TODO_CHANNEL.DELETE, (request: IPCRequest.Todo.IDelete, response: IPCResponse.IBase) => {
    const todoSprintRepository = new TodoSprintRepository()
    const todoRepository = new TodoRepository()
    todoSprintRepository.deleteByTodoId(request.id)
    response.result = todoRepository.delete(request.id)
    return response
})
// 스프린트 가져오기
controller(IPC_TODO_CHANNEL.LOAD_SPRINT, (request: IPCRequest.Todo.ILoadSprint, response: IPCResponse.IBase) => {
    const todoId = request.todoId
    const todoSprintRepository = new TodoSprintRepository()
    const sprints = todoSprintRepository.findByTodoId(todoId)
    response.data.sprints = sprints
    return response
})
// 스프린트 제거
controller(IPC_TODO_CHANNEL.DELETE_SPRINT, (request: IPCRequest.Todo.IDeleteSprint, response: IPCResponse.IBase) => {
    const todoSprintRepository = new TodoSprintRepository()
    response.result = todoSprintRepository.delete(request.id)
    return response
})
