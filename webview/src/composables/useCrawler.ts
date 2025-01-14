import { CRAWLER_COMMAND } from '@/costants/model'
import type { Crawler } from '@/types/model'
import _ from 'lodash'
export const useCrawler = (
    emit: ((event: 'replace', a: number | null, b: number | null) => void) &
        ((event: 'splice', sortNo: number | null, command: Crawler.Command.IBase) => void),
    { sortNo }: { sortNo: number | null }
) => {
    const onCreateRedirectCommand = (event: DragEvent) => {
        event.stopPropagation()
        if (event.dataTransfer) {
            event.dataTransfer.setData(
                'create',
                JSON.stringify({
                    name: CRAWLER_COMMAND.REDIRECT,
                    url: '',
                    timeout: 5000
                })
            )
        }
    }
    const onCreateClickCommand = (event: DragEvent) => {
        event.stopPropagation()
        if (event.dataTransfer) {
            event.dataTransfer.setData(
                'create',
                JSON.stringify({
                    name: CRAWLER_COMMAND.CLICK,
                    selector: '',
                    timeout: 5000
                })
            )
        }
    }
    const onCreateWriteCommand = (event: DragEvent) => {
        event.stopPropagation()
        if (event.dataTransfer) {
            event.dataTransfer.setData(
                'create',
                JSON.stringify({
                    name: CRAWLER_COMMAND.WRITE,
                    selector: '',
                    text: '',
                    timeout: 5000
                })
            )
        }
    }
    const onMoveCommand = (event: DragEvent) => {
        event.stopPropagation()
        if (event.dataTransfer) {
            event.dataTransfer.setData(
                'move',
                JSON.stringify({
                    sortNo
                })
            )
        }
    }
    const onDropCommand = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (!(event && event.dataTransfer)) {
            return
        }
        for (const key of ['create', 'move']) {
            const data = event.dataTransfer.getData(key)
            if (_.isEmpty(data)) {
                continue
            }
            if (key == 'create') {
                const command = JSON.parse(data)
                emit('splice', sortNo, command)
            } else if (key == 'move') {
                const command = JSON.parse(data)
                emit('replace', sortNo, command.sortNo)
            }
        }
    }
    return {
        onCreateRedirectCommand,
        onCreateClickCommand,
        onCreateWriteCommand,
        onMoveCommand,
        onDropCommand
    }
}
