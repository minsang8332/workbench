import Worker from '@/models/crawler/Worker'
import BaseRepository from '@/repositories/BaseRepository'
class WorkerRepository extends BaseRepository<Worker> {
    constructor() {
        super('Worker')
    }
}
export default WorkerRepository
