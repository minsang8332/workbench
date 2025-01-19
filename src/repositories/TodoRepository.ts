import Todo from '@/models/Todo'
import BaseRepository from './BaseRepository'
class TodoRepository extends BaseRepository<Todo> {
    constructor() {
        super('Todo')
    }
}
export default TodoRepository
