import _ from 'lodash'
import { ipcMain } from 'electron'
import Store from '@/tools/store'
import handlerTool from '@/tools/handler'
import AccountBook from '@/models/account-book'
import logger from '@/logger'
const store = new Store<AccountBook>('account-book')
ipcMain.handle('account-book:read', (event, { id }: { id: string }) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const accountBooks = <AccountBook[]>store.get()
        if (!(accountBooks && id)) {
            response.data = { accountBooks }
        } else {
            const accountBook = accountBooks.find((a) => a.id == id)
            response.data = { accountBook }
        }
    } catch (e) {
        logger.error(e)
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle('account-book:save', (event, form: IAccountBookForm) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        if (!form) {
            throw new Error('양식이 유효하지 않습니다.')
        }
        if (form.id) {
            const accountBooks = <AccountBook[]>store.get()
            if (_.isEmpty(accountBooks)) {
                throw new Error('장부 데이터가 없습니다.')
            }
            const foundOne = accountBooks.find((a) => a.id == form.id)
            if (_.isEmpty(foundOne)) {
                throw new Error(
                    `장부에서 { id: ${form.id} } 를 찾을 수 없습니다.`
                )
            }
            foundOne.setTitle(form.title)
            foundOne.setDesc(form.desc)
            foundOne.setPrice(form.price)
            foundOne.setQuantity(form.quantity)
            foundOne.setTax(form.tax)
            foundOne.setIsStock(form.isStock)
            store.update(foundOne)
        } else {
            const accountBook = new AccountBook()
            accountBook.setTitle(form.title)
            accountBook.setDesc(form.desc)
            accountBook.setPrice(form.price)
            accountBook.setQuantity(form.quantity)
            accountBook.setTax(form.tax)
            accountBook.setIsStock(form.isStock)
            store.insert(accountBook)
        }
    } catch (e) {
        logger.error(e)
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle('account-book:remove', (event, { id } = {}) => {
    let response: IHandlerResponse = handlerTool.createResponse()
    try {
        const removed = store.remove(id)
        response.data = { removed }
    } catch (e) {
        logger.error(e)
        response.error = handlerTool.createError(e)
    }
    return response
})
