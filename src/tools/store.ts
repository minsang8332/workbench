import _ from 'lodash'
import ElectronStore from 'electron-store'
import dayjs from 'dayjs'
import logger from '@/logger'
export default class Store<T extends StoreField> {
    key: string
    instance: ElectronStore
    constructor(key: string) {
        this.key = key
        this.instance = new ElectronStore()
    }
    get = (option?: { id: string }) => {
        let storeTable = null
        try {
            storeTable = <T[]>this.instance.get(this.key)
        } catch (e) {
            logger.error(e)
        }
        return storeTable
    }
    set(storeTables: T[]) {
        this.instance.set(this.key, storeTables)
    }
    unset() {
        this.instance.delete(this.key)
    }
    insert(payload: T) {
        let payloads = <T[]>this.get()
        if (_.isNil(payloads)) {
            payloads = []
        }
        const createdAt = new Date()
        if (_.isEmpty(payload.id)) {
            payload.id = dayjs(createdAt).unix().toString()
        }
        if (_.isNil(payload.createdAt)) {
            payload.createdAt = createdAt
        }
        payloads.push(payload)
        this.set(payloads)
    }
    update(payload: T) {
        let payloads = <T[]>this.get()
        if (_.isNil(payloads) || _.isNil(payload.id)) {
            throw new Error('스토어 update 조건이 유효하지 않습니다.')
        }
        const foundIdx = payloads.findIndex((p) => p.id == payload.id)
        if (foundIdx == -1) {
            throw new Error('스토어 update 대상이 유효하지 않습니다.')
        }
        payload.updatedAt = new Date()
        payloads.splice(foundIdx, 1, payload)
        this.set(payloads)
    }
    remove(id: string) {
        try {
            let storeTable = <T[]>this.instance.get(this.key)
            if (storeTable) {
                storeTable.filter((field) => field.id !== id)
                this.set(storeTable)
                return true
            }
        } catch (e) {
            logger.error(e)
        }
        return false
    }
}
