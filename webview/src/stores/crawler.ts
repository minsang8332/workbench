import _ from 'lodash'
import { reactive, computed, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { Crawler } from '@/types/model'
interface ICrawlerStoreState {
    workers: Crawler.IWorker[]
}
export const useCrawlerStore = defineStore('crawler', () => {
    const state = reactive<ICrawlerStoreState>({
        workers: []
    })
    // Getters
    const getWorkers = computed(() => state.workers)
    // Mutations
    const updateWorkers = (payload: Crawler.IWorker[] = []) => {
        state.workers = payload
    }
    // Actions
    const loadWorkers = async () => {
        updateWorkers()
        const response = await window.$native.crawler.loadWorkers()
        updateWorkers(response.data.workers)
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
    const deleteWorker = async (id: Crawler.IWorker['id']) => {
        return await window.$native.crawler.deleteWorker({ id })
    }
    return {
        state,
        getWorkers,
        updateWorkers,
        loadWorkers,
        saveWorker,
        saveWorkerLabel,
        saveWorkerCommands,
        deleteWorker
    }
})
