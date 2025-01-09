import TodoSprint from '@/models/todo-sprint'
import BaseRepository from './repository'
class TodoSprintRepository extends BaseRepository<TodoSprint> {
    constructor() {
        super(TodoSprint.constructor.name)
    }
    findByTodoId(todoId: string) {
        return this.findAll()?.filter((todoSprint) => todoSprint.id == todoId)
    }
    deleteByTodoId(todoId: string) {
        return this.findByTodoId(todoId)?.every((todoSprint) => this.delete(todoSprint.id))
    }
}
export default TodoSprintRepository
