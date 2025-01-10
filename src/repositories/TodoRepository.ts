import Todo from '@/models/todo'
import BaseRepository from './BaseRepository'
class TodoRepository extends BaseRepository<Todo> {
    constructor() {
        super(Todo.name)
    }
}
export default TodoRepository
