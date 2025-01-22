import { CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class Schedule implements Crawler.ISchedule {
    id: Crawler.ISchedule['id']
    workerId: Crawler.ISchedule['workerId']
    status: Crawler.ISchedule['status']
    expression: Crawler.ISchedule['expression']
    firedAt: Crawler.ISchedule['firedAt']
    createdAt: Crawler.ISchedule['createdAt']
    updatedAt: Crawler.ISchedule['updatedAt']
    constructor({
        id = '',
        workerId,
        status = CRAWLER_STATUS.PREPARE,
        expression = '* * * * *',
        firedAt = null,
    }: {
        id?: string
        workerId: string
        status: CRAWLER_STATUS
        expression: string
        firedAt: Date | null
    }) {
        this.id = id
        this.workerId = workerId
        this.status = status
        this.expression = expression
        this.createdAt = new Date()
        this.updatedAt = null
        this.firedAt = firedAt
    }
}
export default Schedule
