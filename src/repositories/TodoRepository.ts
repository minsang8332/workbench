import BaseRepository from './BaseRepository'
import Todo from '@/models/Todo'
class TodoRepository extends BaseRepository<Todo> {
    constructor() {
        super('Todo')
    }
}
export default TodoRepository
