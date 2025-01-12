import { ipcMain } from 'electron'
import logger from '@/logger'
import type { IPCResponse } from '@/types/ipc'
export const controller = async <T>(channel: string, fn: Function) => {
    ipcMain.handle(channel, async (event: Electron.IpcMainInvokeEvent, payload: T) => {
        let response: IPCResponse.IBase = {
            channel,
            result: false,
            message: null,
            data: {},
        }
        try {
            response = await fn(payload, response, {
                event,
            })
            logger.debug(response)
        } catch (e) {
            response.message = '내부 오류가 발생했습니다. 로그 파일을 확인해 주세요'
            logger.error(e)
        }
        return response
    })
}
