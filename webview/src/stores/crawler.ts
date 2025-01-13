import _ from 'lodash'
import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { CRAWLER_STATUS } from '@/costants/model'
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
    const deleteWorker = async (id: Crawler.IWorker['id']) => {
        return await window.$native.crawler.deleteWorker({ id })
    }
    const scrapingSelector = async () => {
        return await window.$native.crawler.scrapingSelector()
    }
    return {
        state,
        getWorkers,
        updateWorkers,
        loadWorkers,
        saveWorker,
        saveWorkerLabel,
        deleteWorker,
        scrapingSelector
    }
})
