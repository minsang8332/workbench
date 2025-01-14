import type { Crawler } from '@/types/model'
class Worket implements Crawler.IWorker {
    id: Crawler.IWorker['id']
    label: Crawler.IWorker['label']
    commands: Crawler.IWorker['commands']
    createdAt: Crawler.IWorker['createdAt']
    updatedAt: Crawler.IWorker['updatedAt']
    constructor({
        id = '',
        label = '',
        commands = [],
    }: {
        id?: string
        label: string
        commands: Crawler.Command.IBase[]
    }) {
        this.id = id
        this.label = label
        this.commands = commands
        this.createdAt = new Date()
        this.updatedAt = null
    }
}
export default Worket
