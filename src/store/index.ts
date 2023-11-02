import _ from 'lodash'
import Store from 'electron-store'
const store = new Store()
const get = (storeType: StoreType, id?: string) => {
    const storeTable = <StoreTable>store.get(storeType)
    if (!id) {
        return storeTable
    }
    if (!_.has(storeTable, id)) {
        return null
    }
    return storeTable[id]
}
const set = (storeType: StoreType, id: string | null, table?: TableType) => {
    let storeTable = <StoreTable>store.get(storeType)
    if (id && table && _.has(storeTable, id)) {
        storeTable[id] = table
        store.set(storeType, storeTable)
    } else {
        store.set(storeType, table)
    }
}
const unset = (storeType: StoreType, id: string) => {
    const storeTable = <StoreTable>store.get(storeType)
    if (!_.has(storeTable, id)) {
        return false
    }
    delete storeTable[id]
    store.set(storeType, storeTable)
}
const remove = (storeType: StoreType) => store.delete(storeType)
export default {
    get,
    set,
    unset,
    remove,
}
