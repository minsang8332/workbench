import { BROWSER_CRAWLER_COMMAND, BROWSER_CRWALER_STATUS } from '@/constants/window'
export namespace WindowUtil {
    // 명령어 세트
    interface ICommandSet {
        label: string
        status: BROWSER_CRWALER_STATUS
        commands: ICommand[]
    }
    // 명령어
    interface ICommand {
        type: BROWSER_CRAWLER_COMMAND
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
    // 실행 내역
    interface IHistory {
        commandSet: ICommandSet
        message: string | null
        error: Error | null
        createdAt: Date
    }
}
