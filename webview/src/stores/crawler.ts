import { reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface ICrawlerState {}
export const useCrawlerStore = defineStore('crawler', () => {
    const state = reactive<ICrawlerState>({})
    // Getters
    // Mutations
    // Actions
    const scrapingSelector = async () => {
        return await window.$native.crawler.scrapingSelector()
    }
    return {
        state,
        scrapingSelector
    }
})
