import _ from 'lodash'
import { TodoStatus } from '@/constants/model'
export class Todo implements ITodo {
    static IDENTIFIER = 'todo'
    id: ITodo['id']
    title: ITodo['title']
    description: ITodo['description']
    status: ITodo['status']
    tasks: ITodo['tasks']
    startedAt: ITodo['startedAt']
    endedAt: ITodo['endedAt']
    createdAt: ITodo['createdAt']
    updatedAt: ITodo['updatedAt']
    constructor({
        id,
        title,
        description = null,
        status = TodoStatus.PREPARE,
        tasks = [],
        startedAt = null,
        endedAt = null,
    }: Omit<ITodo, 'createdAt' | 'updatedAt'>) {
        this.id = id
        this.title = title
        this.description = description
        this.status = status
        this.tasks = tasks
        this.startedAt = startedAt
        this.endedAt = endedAt
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export class TodoTask implements ITodoTask {
    static IDENTIFIER = 'todo-task'
    id: ITodoTask['id']
    title: ITodoTask['title']
    checked: ITodoTask['checked']
    taskId: ITodoTask['taskId']
    createdAt: ITodoTask['createdAt']
    updatedAt: ITodoTask['updatedAt']
    constructor({ id, title, checked = false, taskId = null }: Omit<ITodoTask, 'createdAt' | 'updatedAt'>) {
        this.id = id
        this.taskId = taskId
        this.title = title
        this.checked = checked
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default {
    Todo,
    TodoStatus,
    TodoTask,
}
