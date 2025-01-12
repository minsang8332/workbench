import { CRWALER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class History implements Crawler.IHistory {
    id: Crawler.IHistory['id']
    workerId: Crawler.IHistory['workerId']
    status: Crawler.IHistory['status']
    message: Crawler.IHistory['message']
    error: Crawler.IHistory['error']
    errorRound: Crawler.IHistory['errorRound']
    downloads: Crawler.IHistory['downloads']
    startedAt: Crawler.IHistory['startedAt']
    endedAt: Crawler.IHistory['endedAt']
    createdAt: Crawler.IHistory['createdAt']
    updatedAt: Crawler.IHistory['updatedAt']
    constructor({
        id = '',
        workerId = '',
        status = null,
        message = null,
        error = null,
        errorRound = null,
        downloads = [],
        startedAt,
        endedAt,
    }: {
        id?: Crawler.IHistory['id']
        workerId: Crawler.IWorker['id']
        status?: CRWALER_STATUS | null
        message?: string | null
        error?: Error | null
        errorRound?: number | null
        downloads?: string[]
        startedAt: Date
        endedAt: Date
    }) {
        this.id = id
        this.workerId = workerId
        this.status = status
        this.message = message
        this.error = error
        this.errorRound = errorRound
        this.downloads = downloads
        this.startedAt = startedAt
        this.endedAt = endedAt
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default History
