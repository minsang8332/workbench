import _ from 'lodash'
export const TodoStatus = {
    PREPARE: 0,
    PROCESS: 1,
    DONE: 2,
    HOLD: 3
}
type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus]
export class Todo implements ITodo {
    id: string
    title: string
    description: string
    status: TodoStatus
    tasks: ITodoTask[]
    startedAt: Date | null
    endedAt: Date | null
    constructor ({
        id = '',
        title = '',
        status = TodoStatus.PREPARE,
        description = '',
        startedAt = null,
        endedAt = null
    } = {}) {
        this.id = id
        this.title = title
        this.description = description
        this.status = status
        this.tasks = []
        this.startedAt = startedAt
        this.endedAt = endedAt
    }
}
export class TodoTask implements ITodoTask {
    id: string
    title: string
    description: string
    checked: boolean
    constructor ({
        id = '',
        title = '',
        description = '',
        checked = false,
    } = {}) {
        this.id = id
        this.title = title
        this.description = description
        this.checked = checked
    }
}
export default {
    Todo,
    TodoStatus,
    TodoTask
}