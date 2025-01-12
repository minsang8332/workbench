import _ from 'lodash'
import ElectronStore from 'electron-store'
import type { IStore, IStoreTable } from '@/types/model'
abstract class BaseRepository<T extends IStoreTable> {
    _store: ElectronStore
    _key: string
    constructor(key: string) {
        this._store = new ElectronStore()
        this._key = key
        this.loadStore()
    }
    loadStore = (): IStore<T> | null => {
        let store = this._store.get(this._key) as IStore<T>
        if (_.isEmpty(store)) {
            this.createStore()
            store = this._store.get(this._key) as IStore<T>
        }
        return store
    }
    createStore() {
        this._store.set(this._key, {
            autoIncrement: 0,
            table: [],
        })
    }
    updateStore(store: IStore<T>) {
        this._store.set(this._key, store)
    }
    deleteStore() {
        this._store.delete(this._key)
    }
    findAll = (): T[] => {
        const store = this.loadStore()
        if (!(store && store.table)) {
            throw new Error(`findAll - ${this._key} 테이블을 찾을 수 없습니다.`)
        }
        return store.table
    }
    findOne = (id?: string) => {
        const table = this.findAll()
        return table.find((field) => field.id == id)
    }
    insert(payload: T) {
        const store = this.loadStore()
        if (!(store && store.table)) {
            throw new Error(`insert - ${this._key} 테이블을 찾을 수 없습니다.`)
        }
        if (!_.isEmpty(payload.id)) {
            throw new Error(`insert - ${this._key} id 값을 선언하면 안됩니다.`)
        }
        store.autoIncrement++
        payload.id = _.toString(store.autoIncrement)
        store.table.push(payload)
        this.updateStore(store)
        return payload.id
    }
    update(payload: T) {
        if (_.isNil(payload.id)) {
            throw new Error(`update - ${this._key} id 값이 유효하지 않습니다.`)
        }
        const store = this.loadStore()
        if (!(store && store.table)) {
            throw new Error(`update - ${this._key} 테이블을 찾을 수 없습니다.`)
        }
        const idx = store.table.findIndex((field) => field.id == payload.id)
        if (idx == -1) {
            throw new Error(`update - ${this._key} 필드 ${payload.id} 를 찾을 수 없습니다.`)
        }
        payload.updatedAt = new Date()
        store.table.splice(idx, 1, payload)
        this.updateStore(store)
        return payload.id
    }
    delete(id: string): boolean {
        if (_.isNil(id)) {
            throw new Error(`delete - ${this._key} id 값이 유효하지 않습니다.`)
        }
        const store = this.loadStore()
        if (!(store && store.table)) {
            throw new Error(`delete - ${this._key} 테이블을 찾을 수 없습니다.`)
        }
        const idx = store.table.findIndex((field) => field.id == id)
        if (idx == -1) {
            throw new Error(`delete - ${this._key} 필드 ${id} 를 찾을 수 없습니다.`)
        }
        store.table.splice(idx, 1)
        this.updateStore(store)
        return true
    }
}
export default BaseRepository
