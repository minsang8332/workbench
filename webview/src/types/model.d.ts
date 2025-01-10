interface IDiary {
    path: string
    filename?: string
    isDir: boolean
    createdAt: number
    updatedAt: number
}
interface IDiaryDetail extends IDiary {
    text: string
}
interface ITodo {
    id: string
    title: string // 제목
    description: string // 내용
    status: ITodoStatus['value'] // 상태
    tasks: ITodoSprint[]
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
    createdAt?: Date | null
    updatedAt?: Date | null
}
interface ITodoSprint {
    id?: string
    todoId: string
    title: string
    description: string | null
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
}
interface ITodoStatus {
    label: string
    value: number
}
