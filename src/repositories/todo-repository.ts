import { Todo } from '@/models/todo'
import BaseRepository from './repository'
class TodoRepository extends BaseRepository<Todo> {
    constructor() {
        super(Todo.constructor.name)
    }
}
export default TodoRepository
