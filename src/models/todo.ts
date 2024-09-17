import _ from 'lodash'
export const TodoStatus = {
    PREPARE: 0,
    PROCESS: 1,
    DONE: 2,
    HOLD: 3
}
type TodoStatus = typeof TodoStatus[keyof typeof TodoStatus]
export class Todo implements ITodo {
    id?: string
    title: string
    description: string
    status: TodoStatus
    tasks: ITodoTask[]
    startedAt: Date | null
    endedAt: Date | null
    constructor ({
        title = '',
        status = TodoStatus.PREPARE,
        description = ''
    } = {}) {
        this.title = title
        this.description = description
        this.status = status
        this.tasks = []
        this.startedAt = null
        this.endedAt = null
    }
}
export class TodoTask implements ITodoTask {
    id?: string
    title: string
    description: string
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
    constructor ({
        title = '',
        description = '',
        checked = false
    } = {}) {
        this.title = title
        this.description = description
        this.checked = checked
        this.startedAt = null
        this.endedAt = null
        this.checked = checked
    }
}
export default {
    Todo,
    TodoStatus,
    TodoTask
}