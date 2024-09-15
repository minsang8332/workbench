import _ from 'lodash'
import commonTool from '@/tools/common'
export class TodoStatus implements ITodoStatus {
    id: string = ''
    name: string
    backgroundColor: string
    createdAt: Date | null
    updatedAt: Date | null
    constructor ({
        name = '',
        backgroundColor = ''
    } = {}) {
        this.id = commonTool.randomHex()
        this.name = name
        this.backgroundColor = backgroundColor
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export class Todo implements ITodo {
    id: string
    title: string
    description: string
    status: ITodoStatus
    tasks: ITodoTask[]
    startedAt: Date | null
    endedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    constructor ({
        title = '',
        description = ''
    } = {}) {
        this.id = commonTool.randomHex()
        this.title = title
        this.description = description
        this.status = new TodoStatus()
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