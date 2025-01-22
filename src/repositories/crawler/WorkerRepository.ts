import BaseRepository from '@/repositories/BaseRepository'
import Worker from '@/models/crawler/Worker'
class WorkerRepository extends BaseRepository<Worker> {
    constructor() {
        super('Worker')
    }
}
export default WorkerRepository
