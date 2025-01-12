import _ from 'lodash'
import { controller } from '@/utils/ipc'
import { IPC_TODO } from '@/constants/ipc'
import TodoRepository from '@/repositories/TodoRepository'
import TodoSprintRepository from '@/repositories/TodoSprintRepository'
import TodoService from '@/services/TodoService'
import Todo from '@/models/Todo'
import type { ITodoSprint } from '@/types/model'

// 해야 할 일 목록
controller(IPC_TODO.LOAD, (request: IpcController.Request.Todo.ILoad, response: IpcController.IResponse) => {
    const todoRepository = new TodoRepository()
    const todos = todoRepository.findAll()
    response.data.todos = todos
    response.result = true
    return response
})
// 해야 할 일 편집
controller(IPC_TODO.SAVE, (request: IpcController.Request.Todo.ISave, response: IpcController.IResponse) => {
    const todoService = new TodoService()
    const todoRepository = new TodoRepository()
    const todo = new Todo(request)
    const id = request.id ? todoRepository.update(todo) : todoRepository.insert(todo)
    // 스프린트 일괄 처리
    if (id && _.isArray(request.sprints)) {
        todoService.batchSprints(id, <ITodoSprint[]>request.sprints)
    }
    response.data.id = id
    response.result = true
    return response
})
// 해야 할 일 제거
controller(IPC_TODO.DELETE, (request: IpcController.Request.Todo.IDelete, response: IpcController.IResponse) => {
    const todoSprintRepository = new TodoSprintRepository()
    const todoRepository = new TodoRepository()
    todoSprintRepository.deleteByTodoId(request.id)
    response.result = todoRepository.delete(request.id)
    return response
})
// 스프린트 가져오기
controller(
    IPC_TODO.LOAD_SPRINT,
    (request: IpcController.Request.Todo.ILoadSprint, response: IpcController.IResponse) => {
        const todoId = request.todoId
        const todoSprintRepository = new TodoSprintRepository()
        const sprints = todoSprintRepository.findByTodoId(todoId)
        response.data.sprints = sprints
        response.result = true
        return response
    }
)
// 스프린트 제거
controller(
    IPC_TODO.DELETE_SPRINT,
    (request: IpcController.Request.Todo.IDeleteSprint, response: IpcController.IResponse) => {
        const todoSprintRepository = new TodoSprintRepository()
        response.result = todoSprintRepository.delete(request.id)
        return response
    }
)
