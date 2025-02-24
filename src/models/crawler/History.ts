import _ from 'lodash'
import { CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class History implements Crawler.IHistory {
    id: Crawler.IHistory['id']
    workerId: Crawler.IHistory['workerId']
    label: Crawler.IHistory['label']
    commands: Crawler.IHistory['commands']
    status: Crawler.IHistory['status']
    round: Crawler.IHistory['round']
    totalRound: Crawler.IHistory['totalRound']
    message: Crawler.IHistory['message']
    results: Crawler.IHistory['results']
    startedAt: Crawler.IHistory['startedAt']
    endedAt: Crawler.IHistory['endedAt']
    createdAt: Crawler.IHistory['createdAt']
    updatedAt: Crawler.IHistory['updatedAt']
    constructor({
        id = '',
        workerId = '',
        label = '',
        commands = [],
        status = null,
        round = 0,
        totalRound = 0,
        message = '',
        results = [],
        startedAt,
        endedAt = null,
    }: {
        id?: Crawler.IHistory['id']
        workerId: Crawler.IWorker['id']
        label?: Crawler.IWorker['label']
        commands?: Crawler.IWorker['commands']
        status?: CRAWLER_STATUS | null
        round?: number
        totalRound?: number
        message?: string
        results?: string[]
        startedAt: Date
        endedAt?: Date | null
    }) {
        this.id = id
        this.workerId = workerId
        this.label = label
        this.commands = commands
        this.status = status
        this.round = round
        this.totalRound = totalRound
        this.message = message
        this.results = results
        this.startedAt = startedAt
        this.endedAt = endedAt
        this.createdAt = new Date()
        this.updatedAt = null
    }
    setCommands(payload: Crawler.IWorker['commands'] = []) {
        this.commands = payload
        return this
    }
    setLabel(payload: Crawler.IWorker['label']) {
        this.label = payload
        return this
    }
    setStatus(payload: CRAWLER_STATUS | null = null) {
        this.status = payload
        return this
    }
    setRound(payload: number) {
        this.round = payload
        return this
    }
    setTotalRound(payload: number) {
        this.totalRound = payload
        return this
    }
    setMessage(payload: unknown = '') {
        if (_.isString(payload)) {
            this.message = payload
        } else if (_.isError(payload)) {
            this.message = payload.message
        }
        return this
    }
    setResults(payload: string[] = []) {
        this.results = payload
        return this
    }
    setEndedAt(payload: Date) {
        this.endedAt = payload
        return this
    }
}
export default History
