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
    status: ITodoStatus // 상태
    tasks: ITodoTask[] // 소작업
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 해야 할 일 상태
interface ITodoStatus extends StoreField {
    name: string
    backgroundColor: string
}
// 소 작업 목록
interface ITodoTask extends StoreField {
    title: string
    description: string,
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
}