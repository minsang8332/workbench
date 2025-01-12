import { CRAWLER_COMMAND, CRWALER_STATUS } from '@/constants/model'
export interface IStore<T> {
    autoIncrement: number
    table: T[]
}
export interface IStoreTable {
    id: string
    createdAt: Date
    updatedAt: Date | null
}
// 파일 시스템
export interface IFile {
    path: string
    isDir: boolean
    createdAt: Date
    updatedAt: Date | null
}
// 문서
export interface IDiary extends IFile {}
// 해야 할 일
export interface ITodo extends IStoreTable {
    title: string // 제목
    description: string | null // 내용
    status: TodoStatus // 상태
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 해야 할 일 스프린트
export interface ITodoSprint extends IStoreTable {
    title: string
    checked: boolean
    todoId: ITodo['id']
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
export namespace Crawler {
    // 명령어 세트
    interface ICommandSet {
        label: string
        status: CRWALER_STATUS
        commands: ICommand[]
    }
    // 명령어
    interface ICommand {
        type: CRAWLER_COMMAND
    }
    // 이동 하기 명령어
    interface IRedirectCommand extends ICommand {
        url: string
        timeout: number
    }
    interface IClickCommand extends ICommand {
        selector: string
        timeout: number
    }
    interface IWriteCommand extends ICommand {
        selector: string
        text: string
        timeout: number
    }
    interface ICursorCommand extends ICommand {}
}
