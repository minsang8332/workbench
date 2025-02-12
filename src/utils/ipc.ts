import _ from 'lodash'
import { ipcMain } from 'electron'
import { IPCError } from '@/errors/ipc'
import logger from '@/logger'
import type { IPCResponse } from '@/types/ipc'
export const controller = async <T>(channel: string, fn: Function) => {
    ipcMain.handle(channel, async (event: Electron.IpcMainInvokeEvent, payload: T) => {
        let response: IPCResponse.IBase = {
            channel,
            result: true,
            message: null,
            data: {},
        }
        try {
            response = await fn(payload, response, {
                event,
            })
            logger.debug(response)
        } catch (e: unknown) {
            if (e instanceof IPCError) {
                response.message = e.message
            } else if (e instanceof Error) {
                response.message = '런타임 에러가 발생헀습니다. 로그 파일을 확인해 주세요.'
            }
            response.result = false
            logger.error(e)
        }
        return response
    })
}
