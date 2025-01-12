import History from '@/models/crawler/History'
import BaseRepository from '@/repositories/BaseRepository'
class HistoryRepository extends BaseRepository<History> {
    constructor() {
        super(History.name)
    }
}
export default HistoryRepository
