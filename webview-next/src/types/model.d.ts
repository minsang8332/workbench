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
    id?: string
    title: string // 제목
    description: string // 내용
    status: ITodoStatus.value // 상태
    tasks: ITodoTask[] // 소작업
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
    createdAt?: Date | null
    updatedAt?: Date | null
}
interface ITodoTask {
    id?: string
    title: string
    description: string
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
    createdAt?: Date | null
    updatedAt?: Date | null
}
interface ITodoStatus {
    label: string
    value: number
}
