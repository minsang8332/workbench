import _ from 'lodash'
import { ipcMain } from 'electron'
import Store from '@/tools/store'
import handlerTool from '@/tools/handler'
import Receipt from '@/models/receipt'
import logger from '@/logger'
const store = new Store<Receipt>('receipt')
ipcMain.handle('receipt:read', (event, payload: IpcPayload.Receipt.IRead) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        const receipts = <Receipt[]>store.get()
        if (!(receipts && payload && payload.id)) {
            response.data = { receipts }
        } else {
            const receipt = receipts.find((r) => r.id == payload.id)
            response.data = { receipt }
        }
    } catch (e) {
        logger.error(e)
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle('receipt:save', (event, payload: IpcPayload.Receipt.ISave) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        if (!payload) {
            throw new Error('양식이 유효하지 않습니다.')
        }
        let receipt = new Receipt()
        if (payload.id) {
            const receipts = <Receipt[]>store.get()
            if (_.isEmpty(receipts)) {
                throw new Error('재고자산 수불부 데이터가 없습니다.')
            }
            const receipt = receipts.find((a) => a.id == payload.id)
            if (_.isEmpty(receipt)) {
                throw new Error(
                    `재고자산 수불부에서 { id: ${payload.id} } 를 찾을 수 없습니다.`
                )
            }
        }
        receipt.setTitle(payload.title)
        receipt.setDesc(payload.desc)
        receipt.setPrice(payload.price)
        receipt.setQuantity(payload.quantity)
        receipt.setTax(payload.tax)
        receipt.setStatus(payload.status)
        payload.id ? store.update(receipt) : store.insert(receipt)
    } catch (e) {
        logger.error(e)
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle(
    'receipt:remove',
    (event, payload: IpcPayload.Receipt.IRemove) => {
        let response: IpcHandle.IResponse = handlerTool.createResponse()
        try {
            const removed = store.remove(payload.id)
            response.data = { removed }
        } catch (e) {
            logger.error(e)
            response.error = handlerTool.createError(e)
        }
        return response
    }
)
