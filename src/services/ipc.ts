import { ipcMain } from 'electron'
export const response = async (process: Function) => {
    let response: IpcController.IResponse = {
        data: {},
    }
    try {
        response = await process(response)
    } catch (e) {
        response.error = error(e as Error)
    }
    return response
}
export const controller = async <T>(channel: string, fn: Function) => {
    ipcMain.handle(channel, async (event: Electron.IpcMainInvokeEvent, payload: T) => {
        let response: IpcController.IResponse = {
            data: {},
        }
        try {
            response = await fn(payload, response, {
                event,
            })
        } catch (e) {
            response.error = error(e as Error)
        }
        return response
    })
}
export const error = (error: Error): IpcController.IError | undefined => {
    switch ((error as NodeJS.ErrnoException).code) {
        case 'EBADF':
            error.message = '파일 디스크립터가 유효하지 않습니다. 권한을 확인해 주세요.'
        case 'EPERM':
            error.message = '운영체제의 작업 권한을 확인해주세요.'
            break
        case 'ENOENT':
            error.message = '파일이나 디렉토리를 찾을 수 없습니다 혹은 접근 권한을 확인해 주세요.'
            break
    }
    return error
}
export const transaction = () => {}
export default {
    response,
    controller,
}
