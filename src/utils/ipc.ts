import { ipcMain } from 'electron'
export const controller = async <T>(channel: string, fn: Function) => {
    ipcMain.handle(channel, async (event: Electron.IpcMainInvokeEvent, payload: T) => {
        let response: IpcController.IResponse = {
            result: false,
            message: null,
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
export const error = (error: NodeJS.ErrnoException): IpcController.IError | undefined => {
    if (error && error.code) {
        switch (error.code) {
            case 'EBADF':
                error.message = '파일 디스크립터가 유효하지 않습니다. 권한을 확인해 주세요.'
            case 'EPERM':
                error.message = '운영체제의 작업 권한을 확인해주세요.'
                break
            case 'ENOENT':
                error.message = '파일이나 디렉토리를 찾을 수 없습니다 혹은 접근 권한을 확인해 주세요.'
                break
        }
    }
    return error
}
