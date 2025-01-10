import TodoSprint from '@/models/todo-sprint'
import BaseRepository from './BaseRepository'
class TodoSprintRepository extends BaseRepository<TodoSprint> {
    constructor() {
        super(TodoSprint.name)
    }
    findByTodoId(todoId: string) {
        return this.findAll()?.filter((sprint) => sprint.todoId == todoId)
    }
    deleteByTodoId(todoId: string) {
        return this.findByTodoId(todoId)?.every((sprint) => this.delete(sprint.id))
    }
}
export default TodoSprintRepository
