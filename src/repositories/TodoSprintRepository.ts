import BaseRepository from './BaseRepository'
import TodoSprint from '@/models/TodoSprint'
class TodoSprintRepository extends BaseRepository<TodoSprint> {
    constructor() {
        super('TodoSprint')
    }
    findByTodoId(todoId: string) {
        return this.findAll()?.filter((sprint) => sprint.todoId == todoId)
    }
    deleteByTodoId(todoId: string) {
        return this.findByTodoId(todoId)?.every((sprint) => this.delete(sprint.id))
    }
}
export default TodoSprintRepository
