import { TODO_STATUS } from '@/constants/model'
import { Crawler as CrawlerModel } from '@/types/model'
export namespace IPCRequest {
    namespace App {
        interface ILoadOverlayVideos {}
        interface IUpdateOverlayVideo {}
    }
    namespace Diary {
        interface ILoad {}
        // 문서 내용 가져오기
        interface IRead {
            filepath: string /* 가져올 파일 경로 */
        }
        // 문서 저장
        interface IWrite {
            filepath: string /* 저장할 파일 경로 */
            filename?: string
            text?: string /* 파일 내용 */
            ext?: string /* 확장자명 */
        }
        // 문서 폴더 생성
        interface IWriteDir {
            dirpath: string
            dirname: string
        }
        interface IDelete {
            filepath: string
        }
        interface IRename {
            filepath: string
            filename: string
        }
        interface IMove {
            frompath: string /* 무엇을 옮길지 경로*/
            destpath: string /* 어디로 옮길지 경로 */
        }
    }
    // 해야 할 일
    namespace Todo {
        interface ILoad {}
        // 저장하기
        interface ISave {
            id?: string
            title: string
            description?: string | null
            status: TODO_STATUS
            startedAt: Date | null
            endedAt: Date | null
            sprints?: Request.Todo.ISaveSprint[]
        }
        // 제거하기
        interface IDelete {
            id: string
        }
        interface ILoadSprint {
            todoId: string
        }
        interface ISaveSprint {
            id?: string
            todoId: string
            title: string
            checked: boolean
            startedAt?: Date | null
            endedAt?: Date | null
        }
        interface IDeleteSprint {
            id: string
        }
    }
    // 환경설정
    namespace Setting {
        interface ILoadPasscode {}
        interface IUpdatePasscode {
            text: string
        }
        interface IVerifyPasscode {
            text: string
        }
        interface IActivatePasscode {
            active: string
        }
    }
    // 웹 자동화
    namespace Crawler {
        interface ILoadWorkers {}
        interface ISaveWorker {
            id?: string
            label: string
            commands: CrawlerModel.IWorker['commands']
        }
        interface ISaveWorkerLabel {
            id: string
            label: string
        }
        interface ISaveWorkerCommands {
            id: string
            commands: CrawlerModel.Command.IBase[]
        }
        interface IDeleteWorker {
            id: string
        }
        interface IRunWorker {
            id: string
        }
        interface ILoadHistories {}
        interface IScrapingSelector {}
    }
}
export namespace IPCResponse {
    interface IBase {
        channel: string
        result: boolean
        message: string | null
        data: Record<string, any>
    }
}
