import _ from 'lodash'
import { controller } from '@/utils/ipc'
import Todo from '@/models/todo'
import { IPC_TODO } from '@/constants/ipc'
import TodoRepository from '@/repositories/todo.repository'
import TodoSprintRepository from '@/repositories/todo-sprint.repository'
import TodoSprint from '@/models/todo-sprint'
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
    const todoRepository = new TodoRepository()
    const todo = new Todo(request)
    const id = request.id ? todoRepository.update(todo) : todoRepository.insert(todo)
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
        const todoSprints = todoSprintRepository.findByTodoId(todoId)
        response.data.todoSprints = todoSprints
        return response
    }
)
// 스프린트 생성 및 편집
controller(
    IPC_TODO.SAVE_SPRINT,
    (request: IpcController.Request.Todo.ISaveSprint, response: IpcController.IResponse) => {
        const todoSprintRepository = new TodoSprintRepository()
        const todoSprint = new TodoSprint(request)
        const id = request.id ? todoSprintRepository.update(todoSprint) : todoSprintRepository.insert(todoSprint)
        response.data.id = id
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
