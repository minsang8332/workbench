import _ from 'lodash'
import ElectronStore from 'electron-store'
import commonUtil from '@/utils/common'
import logger from '@/utils/logger'
abstract class BaseRepository<T extends IStore> {
    _store: ElectronStore
    _key: string
    constructor(key: string) {
        this._store = new ElectronStore()
        this._key = key
    }
    updateTable(table: T[]) {
        this._store.set(this._key, table)
    }
    deleteTable() {
        this._store.delete(this._key)
    }
    findOne = (id?: string) => {
        let field: T | undefined
        try {
            const table = <T[]>this._store.get(this._key)
            field = table.find((field) => field.id == id)
        } catch (e) {
            logger.error(e)
        }
        return field
    }
    findAll = () => {
        let table: T[] | null = null
        try {
            table = <T[]>this._store.get(this._key)
        } catch (e) {
            logger.error(e)
        }
        return table
    }
    insert(payload: T) {
        let table = <T[]>this.findAll()
        if (_.isNil(table)) {
            table = []
        }
        payload.id = commonUtil.getRandomHex()
        payload.createdAt = new Date()
        if (table.find((field) => field.id == payload.id)) {
            throw new Error('스토어 id 가 이미 존재합니다.')
        }
        table.push(payload)
        this.updateTable(table)
        return payload.id
    }
    update(payload: T) {
        let table = <T[]>this.findAll()
        if (!(table && payload.id)) {
            throw new Error('스토어 update 조건이 유효하지 않습니다.')
        }
        const idx = table.findIndex((field) => field.id == payload.id)
        if (idx == -1) {
            throw new Error('스토어 대상 id 를 찾을 수 없습니다.')
        }
        payload.updatedAt = new Date()
        table.splice(idx, 1, payload)
        this.updateTable(table)
        return payload.id
    }
    remove(id: string): boolean {
        let result = false
        try {
            let table = <T[]>this._store.get(this._key)
            if (table) {
                result = table.find((field) => field.id == id) ? true : false
                table = table.filter((field) => field.id !== id)
                this.updateTable(table)
            }
        } catch (e) {
            logger.error(e)
        }
        return result
    }
}
export default BaseRepository
