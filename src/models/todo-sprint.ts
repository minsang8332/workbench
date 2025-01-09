class TodoSprint implements ITodoSprint {
    id: ITodoSprint['id']
    todoId: ITodoSprint['todoId']
    title: ITodoSprint['title']
    checked: ITodoSprint['checked']
    startedAt: ITodoSprint['startedAt']
    endedAt: ITodoSprint['endedAt']
    createdAt: ITodoSprint['createdAt']
    updatedAt: ITodoSprint['updatedAt']
    constructor({
        id = '',
        title = '',
        checked = false,
        todoId = '',
        startedAt = null,
        endedAt = null,
    }: {
        id?: string
        todoId: ITodo['id']
        title: string
        checked: boolean
        startedAt?: Date | null
        endedAt?: Date | null
    }) {
        this.id = id
        this.todoId = todoId
        this.title = title
        this.checked = checked
        this.startedAt = startedAt
        this.endedAt = endedAt
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default TodoSprint
