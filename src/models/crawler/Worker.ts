import { CRAWLER_STATUS } from '@/constants/model'
import type { Crawler } from '@/types/model'
class Worket implements Crawler.IWorker {
    id: Crawler.IWorker['id']
    label: Crawler.IWorker['label']
    status: Crawler.IWorker['status']
    commands: Crawler.IWorker['commands']
    createdAt: Crawler.IWorker['createdAt']
    updatedAt: Crawler.IWorker['updatedAt']
    constructor({
        id = '',
        label = '',
        status = CRAWLER_STATUS.PREPARE,
        commands = [],
    }: {
        id?: string
        label: string
        status: CRAWLER_STATUS
        commands: Crawler.Command.IBase[]
    }) {
        this.id = id
        this.label = label
        this.status = status
        this.commands = commands
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default Worket
