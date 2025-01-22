import BaseRepository from '@/repositories/BaseRepository'
import History from '@/models/crawler/History'
class HistoryRepository extends BaseRepository<History> {
    constructor() {
        super('History')
    }
}
export default HistoryRepository
