namespace IpcController {
    interface IError {
        name: string | null
        message: string | null
    }
    interface IResponse {
        data: object
        error?: IError
    }
    namespace IRequest {
        interface Empty {}
        namespace Diary {
            interface ILoad {}
            interface IRead {
                target: string
            }
            interface IWrite {
                target: string
                filename?: string
                text?: string
                ext?: string
            }
            interface IWriteDir {
                target: string
                dirname: string
            }
            interface IRemove {
                target: string
            }
            interface IRename {
                target: string
                rename: string
            }
            interface IMove {
                target: string
                dest: string
            }
        }
        // 해야 할 일
        namespace Todo {
            // 저장하기
            interface ISave {
                id: ITodo.id
                title: ITodo.title
                description: ITodo.description
                status: ITodo.status
                tasks: ITodo.tasks
                startedAt: ITodo.startedAt
                endedAt: ITodo.endedAt
            }
            // 제거하기
            interface IRemove {
                id: ITodo.id
            }
        }
        // 설정하기
        namespace Setting {
            // 패스코드 변경하기
            interface IUpdatePasscode {
                passcode: IPasscode.passcode
            }
            // 패스코드 검증하기
            interface IVerifyPasscode {
                passcode: IPasscode.passcode
            }
            interface IActivatePasscode {
                usePasscode: IPasscode.usePasscode
            }
        }
    }
}
