import _ from 'lodash'
import ElectronStore from 'electron-store'
import commonUtil from '@/utils/common'
import logger from '@/utils/logger'
export default class Store<T extends IStoreField> {
    key: string
    instance: ElectronStore
    constructor(key: string) {
        this.key = key
        this.instance = new ElectronStore()
    }
    get = (option?: { id?: string }) => {
        let table = null
        try {
            table = <T[]>this.instance.get(this.key)
            if (table && option && option.id) {
                return table.find((t) => t.id == option.id)
            }
        } catch (e) {
            logger.error(e)
        }
        return table
    }
    set(table: T[]) {
        this.instance.set(this.key, table)
    }
    unset() {
        this.instance.delete(this.key)
    }
    insert(payload: T) {
        let table = <T[]>this.get()
        if (_.isNil(table)) {
            table = []
        }
        payload.id = commonUtil.getRandomHex()
        payload.createdAt = new Date()
        if (table.find((record) => record.id == payload.id)) {
            throw new Error('스토어 id 가 이미 존재합니다.')
        }
        table.push(payload)
        this.set(table)
        return payload.id
    }
    update(payload: T) {
        let table = <T[]>this.get()
        if (!(table && payload.id)) {
            throw new Error('스토어 update 조건이 유효하지 않습니다.')
        }
        const idx = table.findIndex((record) => record.id == payload.id)
        if (idx == -1) {
            throw new Error('스토어 대상 id 를 찾을 수 없습니다.')
        }
        payload.updatedAt = new Date()
        table.splice(idx, 1, payload)
        this.set(table)
        return payload.id
    }
    remove(id: string): T | undefined {
        let field
        try {
            let table = <T[]>this.instance.get(this.key)
            if (table) {
                field = table.find((record) => record.id == id)
                table = table.filter((field) => field.id !== id)
                this.set(table)
            }
        } catch (e) {
            logger.error(e)
        }
        return field
    }
}
