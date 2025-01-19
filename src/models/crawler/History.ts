import { CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class History implements Crawler.IHistory {
    id: Crawler.IHistory['id']
    status: Crawler.IHistory['status']
    round: Crawler.IHistory['round']
    message: Crawler.IHistory['message']
    error: Crawler.IHistory['error']
    commands: Crawler.IHistory['commands']
    workerId: Crawler.IHistory['workerId']
    downloads: Crawler.IHistory['downloads']
    startedAt: Crawler.IHistory['startedAt']
    endedAt: Crawler.IHistory['endedAt']
    createdAt: Crawler.IHistory['createdAt']
    updatedAt: Crawler.IHistory['updatedAt']
    constructor({
        id = '',
        status = null,
        round = null,
        message = null,
        error = null,
        workerId = '',
        commands = [],
        downloads = [],
        startedAt,
        endedAt = null,
    }: {
        id?: Crawler.IHistory['id']
        status?: CRAWLER_STATUS | null
        round?: number | null
        message?: string | null
        error?: Error | null
        workerId: Crawler.IWorker['id']
        commands?: Crawler.IWorker['commands']
        downloads?: string[]
        startedAt: Date
        endedAt?: Date | null
    }) {
        this.id = id
        this.status = status
        this.round = round
        this.message = message
        this.error = error
        this.workerId = workerId
        this.commands = commands
        this.downloads = downloads
        this.startedAt = startedAt
        this.endedAt = endedAt
        this.createdAt = new Date()
        this.updatedAt = null
    }

    setStatus(payload: CRAWLER_STATUS | null = null) {
        this.status = payload
        return this
    }
    setRound(payload: number) {
        this.status = payload
        return this
    }
    setMessage(payload: string = '') {
        this.message = payload
        return this
    }
    setError(payload: unknown) {
        if (payload instanceof Error) {
            this.error = payload
        }
        return this
    }
    setCommands(payload: Crawler.IWorker['commands'] = []) {
        this.commands = payload
        return this
    }
    setDownloads(payload: string[] = []) {
        this.downloads = payload
        return this
    }
    setEndedAt(payload: Date) {
        this.endedAt = payload
        return this
    }
}
export default History
