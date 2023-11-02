import _ from 'lodash'
import { ipcMain } from 'electron'
import categoryStore from '@/store/category'
ipcMain.handle('category:get', (event): Category | false => {
    return categoryStore.getCategory()
})
ipcMain.handle('category:set', (event, payload: Category) => {
    categoryStore.setCategory(payload)
})
