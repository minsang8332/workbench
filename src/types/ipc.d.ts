namespace IpcHandle {
    interface IResponse {
        data: object
        error?: IError
    }
    interface IError {
        name: string | null
        message: string | null
    }
}
namespace IpcPayload {
    namespace Receipt {
        interface IRead {
            id: string
        }
        interface ISave extends IAccountBook {
            id?: string
            title: string
            desc?: string
            price?: number
            quantity?: number
            tax?: number
            isStock?: boolean
        }
        interface IRemove {
            id: string
        }
    }
    namespace Diary {
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
}
