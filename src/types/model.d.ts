interface IStoreField {
    id: string
    createdAt: Date
    updatedAt: Date | null
}
interface IStoreTable<T extends IStoreField> {
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
interface ITodo extends IStoreField {
    title: string // 제목
    description: string | null // 내용
    status: TodoStatus // 상태
    tasks: ITodoTask[] // 소작업
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 해야 할 일의 작은 목표
interface ITodoTask extends IStoreField {
    title: string
    checked: boolean
    taskId: ITodo['id'] | null
}
