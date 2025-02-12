import { CRAWLER_COMMAND, CRAWLER_STATUS } from '@/constants/model'
export interface IRepository<T extends IModel> {
    autoIncrement: number
    table: T[]
}
export interface IModel {
    id: string
    createdAt: Date
    updatedAt: Date | null
}
export interface IFile {
    path: string
    isDir: boolean
    createdAt: Date
    updatedAt: Date | null
}
// 문서
export interface IDiary extends IFile {}
// 해야 할 일
export interface ITodo extends IModel {
    title: string // 제목
    description: string | null // 내용
    status: TODO_STATUS // 상태
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 해야 할 일 스프린트
export interface ITodoSprint extends IModel {
    title: string
    checked: boolean
    todoId: ITodo['id']
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
// 웹 자동화
export namespace Crawler {
    interface IWorker extends IModel {
        label: string
        commands: (
            | Crawler.Command.IBase
            | Crawler.Command.IRedirect
            | Crawler.Command.IClick
            | Crawler.Command.IWrite
        )[]
    }
    interface IHistory extends IModel {
        workerId: Crawler.IWorker['id']
        label: Crawler.IWorker['label']
        commands: Crawler.IWorker['commands']
        status: CRAWLER_STATUS | null
        round: number
        totalRound: number
        message: string
        downloads: string[]
        startedAt: Date
        endedAt: Date | null
    }
    interface ISchedule extends IModel {
        workerId: Crawler.IWorker['id']
        status: CRAWLER_STATUS
        active: boolean
        expression: string
        firedAt: Date | null
    }
    namespace Command {
        interface IBase {
            name: CRAWLER_COMMAND
        }
        interface IRedirect extends Crawler.Command.IBase {
            url: string
            timeout: number
        }
        interface IClick extends Crawler.Command.IBase {
            selector: string
            timeout: number
        }
        interface IWrite extends Crawler.Command.IBase {
            selector: string
            text: string
            timeout: number
        }
        interface ICursor extends Crawler.Command.IBase {}
    }
}
