import TodoRepository from '@/repositories/TodoRepository'
import TodoSprintRepository from '@/repositories/TodoSprintRepository'
import TodoSprint from '@/models/TodoSprint'
import type { ITodo, ITodoSprint } from '@/types/model'
class TodoService {
    _todoRepositroy: TodoRepository
    _todoSprintRepository: TodoSprintRepository
    constructor() {
        this._todoRepositroy = new TodoRepository()
        this._todoSprintRepository = new TodoSprintRepository()
    }
    // 스프린트 일괄 처리 함수
    batchSprints(todoId: ITodo['id'], sprints: ITodoSprint[]) {
        const inserts = []
        const updates = []
        const deletes = []
        const origins = this._todoSprintRepository.findByTodoId(todoId)
        // 제거 대상 선별
        for (let i = 0; i < origins.length; i++) {
            let exists = false
            for (let j = 0; j < sprints.length; j++) {
                const sprint = sprints[j]
                if (origins[i].id == sprint.id) {
                    exists = true
                    break
                }
            }
            // 원본에 없다면 제거하기
            if (!exists) {
                deletes.push(origins[i])
                origins.splice(i, 1)
                i--
                continue
            }
        }
        // 생성 및 수정 대상 선별
        for (let i = 0; i < sprints.length; i++) {
            let exists = false
            for (let j = 0; j < origins.length; j++) {
                if (sprints[i].id == origins[j].id) {
                    exists = true
                    break
                }
            }
            // 원본에 없다면 생성하기
            if (exists) {
                updates.push(sprints[i])
            } else {
                inserts.push(sprints[i])
            }
            sprints.splice(i, 1)
            i--
        }
        deletes.forEach((sprint) => this._todoSprintRepository.delete(sprint.id))
        inserts.forEach((sprint) =>
            this._todoSprintRepository.insert(
                new TodoSprint({
                    todoId,
                    title: sprint.title,
                    checked: sprint.checked,
                    startedAt: sprint.startedAt,
                    endedAt: sprint.endedAt,
                })
            )
        )
        updates.forEach((sprint) => this._todoSprintRepository.update(new TodoSprint(sprint)))
    }
}
export default TodoService
