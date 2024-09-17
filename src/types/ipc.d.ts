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
    namespace Todo {
        interface ISave {
            id?: ITodo.id
            title: ITodo.title
            description?: ITodo.description
            status: TodoStatus
            tasks?: ITodoTask[]
            startedAt?: ITodo.startedAt
            endedAt?: ITodo.endedAt
        }
        interface IRemove {
            id: ITodo.id
        }
    }
}
