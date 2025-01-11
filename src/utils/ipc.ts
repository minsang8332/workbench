import { ipcMain } from 'electron'
import logger from '@/logger'
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
            logger.error(e)
            response.error = error(e as Error)
        }
        return response
    })
}
export const error = (error: NodeJS.ErrnoException): IpcController.IError | undefined => {
    if (error && error.code) {
        switch (error.code) {
            case 'EBADF':
                error.message = '파일 디스크립터가 유효하지 않습니다. 관리자 권한으로 실행해 주세요.'
            case 'EPERM':
                error.message = '파일을 쓰고 읽을 수 있는 권한이 없습니다. 관리자 권한으로 실행해 주세요.'
                break
            case 'ENOENT':
                error.message = '파일이나 디렉토리를 찾을 수 없습니다. 관리자 권한으로 실행해 주세요.'
                break
        }
    }
    return error
}
