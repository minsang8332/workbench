import _ from 'lodash'
import commonTool from '@/tools/common'
export class Todo implements ITodo {
    id: string
    title: string
    description: string
    status: TodoStatus
    tasks: ITodoTask[]
    startedAt: Date | null
    endedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    constructor ({
        title = '',
        status = TodoStatus.PREPARE,
        description = ''
    } = {}) {
        this.id = commonTool.randomHex()
        this.title = title
        this.description = description
        this.status = status
        this.tasks = []
        this.startedAt = null
        this.endedAt = null
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export class TodoTask implements ITodoTask {
    id: string
    title: string
    description: string
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    constructor ({
        title = '',
        description = '',
        checked = false
    } = {}) {
        this.id = commonTool.randomHex()
        this.title = title
        this.description = description
        this.checked = checked
        this.startedAt = null
        this.endedAt = null
        this.checked = checked
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default {
    Todo,
    TodoStatus,
    TodoTask
}