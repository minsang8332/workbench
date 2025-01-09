interface IStore {
    id: string
    createdAt: Date
    updatedAt: Date | null
}
interface IStoreTable<T extends IStore> {
    [props: string]: T[]
}
// 파일 시스템
interface IFile {
    path: string
    isDir: boolean
    createdAt: Date
    updatedAt: Date | null
}
// 문서
interface IDiary extends IFile {}
// 해야 할 일
interface ITodo extends IStore {
    title: string // 제목
    description: string | null // 내용
    status: TodoStatus // 상태
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 해야 할 일 스프린트
interface ITodoSprint extends IStore {
    title: string
    checked: boolean
    todoId: ITodo['id']
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
