import BaseRepository from '@/repositories/BaseRepository'
import Schedule from '@/models/crawler/Schedule'
import { CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class ScheduleRepository extends BaseRepository<Schedule> {
    constructor() {
        super('Schedule')
    }
    findByPrepare() {
        return this.findAll().filter((schedule) => schedule.active && schedule.status === CRAWLER_STATUS.PREPARE)
    }
    updateStatus(id: Crawler.ISchedule['id'], status: CRAWLER_STATUS, firedAt: Crawler.ISchedule['firedAt'] = null) {
        const schedule = this.findOne(id)
        if (schedule) {
            let table = { ...schedule, status }
            if (firedAt) {
                table.firedAt = firedAt
            }
            return this.update(table)
        }
    }
}
export default ScheduleRepository
