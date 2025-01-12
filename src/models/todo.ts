import _ from 'lodash'
import { TODO_STATUS } from '@/constants/model'
import type { ITodo } from '@/types/model'
class Todo implements ITodo {
    id: ITodo['id']
    title: ITodo['title']
    description: ITodo['description']
    status: ITodo['status']
    startedAt: ITodo['startedAt']
    endedAt: ITodo['endedAt']
    createdAt: ITodo['createdAt']
    updatedAt: ITodo['updatedAt']
    constructor({
        id = '',
        title = '',
        description = null,
        status = TODO_STATUS.PREPARE,
        startedAt = null,
        endedAt = null,
    }: {
        id?: string
        title: string
        description?: string | null
        status: TODO_STATUS
        startedAt?: Date | null
        endedAt?: Date | null
    }) {
        this.id = id
        this.title = title
        this.description = description
        this.status = status
        this.startedAt = startedAt
        this.endedAt = endedAt
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default Todo
