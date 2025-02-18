import _ from 'lodash'
import { reactive, computed, toRef } from 'vue'
import { defineStore } from 'pinia'
import type { Crawler } from '@/types/model'
interface ICrawlerStoreState {
    workers: Crawler.IWorker[]
    histories: Crawler.IHistory[]
}
export const useCrawlerStore = defineStore('crawler', () => {
    const state = reactive<ICrawlerStoreState>({
        workers: [],
        histories: []
    })
    // Getters
    const getWorkers = computed(() => state.workers)
    const getHistories = computed(() => state.histories)
    // Mutations
    const updateWorkers = (payload: Crawler.IWorker[] = []) => {
        state.workers = payload
    }
    const updateHistories = (payload: Crawler.IHistory[] = []) => {
        state.histories = payload
    }
    // Actions
    const loadWorkers = async () => {
        updateWorkers()
        const response = await window.$native.crawler.loadWorkers()
        updateWorkers(response.data.workers)
        return response
    }
    const loadSchedule = async (payload: Crawler.IWorker['id']) => {
        const response = await window.$native.crawler.loadSchedule({ workerId: payload })
        return response
    }
    const loadHistories = async () => {
        updateHistories()
        const response = await window.$native.crawler.loadHistories()
        updateHistories(response.data.histories)
        return response
    }
    const saveWorker = async (payload: Crawler.IWorker) => {
        return await window.$native.crawler.saveWorker(payload)
    }
    const saveWorkerLabel = async ({
        id,
        label
    }: {
        id: Crawler.IWorker['id']
        label: Crawler.IWorker['label']
    }) => {
        return await window.$native.crawler.saveWorkerLabel({ id, label })
    }
    const saveWorkerCommands = async ({
        id,
        commands
    }: {
        id: Crawler.IWorker['id']
        commands: Crawler.IWorker['commands']
    }) => {
        commands = JSON.parse(JSON.stringify(commands))
        return await window.$native.crawler.saveWorkerCommands({ id, commands })
    }
    const saveSchedule = async (payload: {
        id?: Crawler.ISchedule['id']
        workerId: Crawler.ISchedule['workerId']
        active: Crawler.ISchedule['active']
        expression: Crawler.ISchedule['expression']
    }) => {
        return await window.$native.crawler.saveSchedule(payload)
    }
    const deleteWorker = async (id: Crawler.IWorker['id']) => {
        return await window.$native.crawler.deleteWorker({ id })
    }
    const runWorker = async (id: Crawler.IWorker['id']) => {
        return await window.$native.crawler.runWorker({ id })
    }
    return {
        state,
        getWorkers,
        getHistories,
        updateWorkers,
        loadWorkers,
        loadSchedule,
        loadHistories,
        saveWorker,
        saveWorkerLabel,
        saveWorkerCommands,
        saveSchedule,
        deleteWorker,
        runWorker
    }
})
