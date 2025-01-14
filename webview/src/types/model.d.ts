import { TODO_STATUS, CRAWLER_STATUS, CRAWLER_COMMAND } from '@/costants/model'
export interface IModel {
    id?: string
    createdAt?: Date
    updatedAt?: Date | null
}
export interface IFile {
    path: string
    isDir: boolean
    createdAt: Date
    updatedAt: Date | null
}
export interface IDiary extends IFile {
    path: string
    isDir: boolean
    filename?: string
    createdAt: number
    updatedAt: number
}
export interface ITodo extends IModel {
    title: string // 제목
    description: string // 내용
    status: TODO_STATUS
    tasks: ITodoSprint[]
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
}
export interface ITodoSprint extends IModel {
    todoId: string
    title: string
    description: string | null
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
}
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
        status: CRAWLER_STATUS | null
        message: string | null
        error: Error | null
        errorRound: number | null
        downloads: string[]
        startedAt: Date
        endedAt: Date
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
