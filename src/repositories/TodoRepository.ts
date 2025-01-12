import Todo from '@/models/Todo'
import BaseRepository from './BaseRepository'
class TodoRepository extends BaseRepository<Todo> {
    constructor() {
        super(Todo.name)
    }
}
export default TodoRepository
