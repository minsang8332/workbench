interface StoreField {
    [props]: string | number | boolean | Date | null
    id?: string
    createdAt?: Date | null
    updatedAt?: Date | null
}
interface StoreTable<T extends StoreField> {
    [props: string]: T[]
}
// 파일 시스템
interface IFile {
    path: string
    isDir: boolean
    createdAt: Date | null
    updatedAt: Date | null
}
// 문서
interface IDiary extends IFile {}
// 해야 할 일
interface ITodo extends StoreField {
    title: string, // 제목
    description: string, // 내용
    status: TodoStatus // 상태
    tasks: ITodoTask[] // 소작업
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 소 작업 목록
interface ITodoTask extends StoreField {
    title: string
    description: string,
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
}