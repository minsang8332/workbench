import _ from 'lodash'
import { inject, unref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CRAWLER_COMMAND } from '@/costants/model'
import { useAppStore } from '@/stores/app'
import { useCrawlerStore } from '@/stores/crawler'
import type { Crawler } from '@/types/model'
import { storeToRefs } from 'pinia'
interface ICrawlerState {
    commands: Crawler.IWorker['commands']
    commandForm: {
        modal: boolean
        props: (Crawler.Command.IBase & { sortNo: number }) | null
    }
}
export const crawlerState = reactive(<ICrawlerState>{
    commands: [],
    commandForm: {
        modal: false,
        props: null
    }
})
export const useCrawler = (state: ICrawlerState) => {
    const $toast = inject('toast') as IToastPlugin
    const route = useRoute()
    const router = useRouter()
    const appStore = useAppStore()
    const crawlerStore = useCrawlerStore()
    const { getWorkers } = storeToRefs(crawlerStore)
    const loadWorker = () => {
        crawlerStore
            .loadWorkers()
            .then(() => {
                const workers = unref(getWorkers)
                if (!(workers && workers.length > 0)) {
                    return
                }
                if (_.isEmpty(route.params.id)) {
                    const id = _.first(workers)?.id
                    router.push({ name: 'crawler-worker', params: { id } })
                    return
                }
                const worker = workers.find((worker) => worker.id == route.params.id)
                if (!(worker && worker.id)) {
                    crawlerState.commands = []
                    return
                }
                crawlerState.commands = [...worker.commands]
            })
            .catch((e) => {
                console.error(e)
                $toast.error(new Error('자동화 세트를 불러올 수 없습니다.'))
            })
    }
    const onToggleCommandForm = (modal: boolean, sortNo?: number) => {
        if (!_.isBoolean(modal)) {
            return
        }
        if (modal && _.isNumber(sortNo)) {
            state.commandForm.props = _.merge({ sortNo }, state.commands[sortNo])
        } else {
            state.commandForm.props = null
        }
        state.commandForm.modal = modal
    }
    const onCommandContextMenu = (event: MouseEvent, sortNo?: number) => {
        event.stopPropagation()
        if (event.button != 2) {
            return
        }
        let items = [
            {
                name: 'refresh',
                desc: '새로고침',
                shortcut: 'R',
                icon: 'mdi:mdi-refresh',
                cb() {
                    loadWorker()
                    appStore.toggleMenu(false)
                }
            }
        ]
        if (_.isNumber(sortNo)) {
            items = [
                ...items,
                {
                    name: 'edit-label-worker',
                    desc: '카드 편집',
                    shortcut: 'E',
                    icon: 'mdi:mdi-file-edit-outline',
                    cb() {
                        onToggleCommandForm(true, sortNo)
                        appStore.toggleMenu(false)
                    }
                },
                {
                    name: 'delete-worker',
                    desc: '카드 삭제',
                    shortcut: 'D',
                    icon: 'mdi:mdi-trash-can-outline',
                    cb() {
                        onDeleteCommands(sortNo)
                        appStore.toggleMenu(false)
                    }
                }
            ]
        }
        appStore.toggleMenu(true, {
            pageX: event.pageX,
            pageY: event.pageY,
            items
        })
    }
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
    const onUpdateRedirectCommand = (
        sortNo: number,
        url: Crawler.Command.IRedirect['url'],
        timeout: Crawler.Command.IRedirect['timeout']
    ) => {
        state.commands[sortNo] = {
            name: CRAWLER_COMMAND.REDIRECT,
            url,
            timeout: _.toNumber(timeout)
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
    const onUpdateClickCommand = (
        sortNo: number,
        selector: Crawler.Command.IClick['selector'],
        timeout: Crawler.Command.IClick['timeout']
    ) => {
        state.commands[sortNo] = {
            name: CRAWLER_COMMAND.CLICK,
            selector,
            timeout: _.toNumber(timeout)
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
    const onUpdateWriteCommand = (
        sortNo: number,
        selector: Crawler.Command.IWrite['selector'],
        text: Crawler.Command.IWrite['text'],
        timeout: Crawler.Command.IWrite['timeout']
    ) => {
        state.commands[sortNo] = {
            name: CRAWLER_COMMAND.WRITE,
            selector,
            text,
            timeout: _.toNumber(timeout)
        }
    }
    const onMoveAnyCommand = (event: DragEvent, sortNo: number) => {
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
    const onDropInContainer = (event: DragEvent) => {
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
                state.commands.push(command)
            } else if (key == 'move') {
                const command = JSON.parse(data)
                const tmp = state.commands[command.sortNo]
                state.commands.splice(command.sortNo, 1)
                state.commands.push(tmp)
            }
        }
    }
    const onDropOntoCard = (event: DragEvent, sortNo: number | null) => {
        event.preventDefault()
        event.stopPropagation()
        if (!(event && event.dataTransfer && _.isNumber(sortNo))) {
            return
        }
        for (const key of ['create', 'move']) {
            const data = event.dataTransfer.getData(key)
            if (_.isEmpty(data)) {
                continue
            }
            if (key == 'create') {
                const command = JSON.parse(data)
                onSpliceCommands(sortNo, command)
            } else if (key == 'move') {
                const command = JSON.parse(data)
                onReplaceCommands(sortNo, command.sortNo)
            }
        }
    }
    const onDropInContent = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        if (!(event && event.dataTransfer)) {
            return
        }
        const data = event.dataTransfer.getData('move')
        if (data) {
            const command = JSON.parse(data)
            if (_.isNumber(command.sortNo)) {
                onDeleteCommands(command.sortNo)
            }
        }
    }
    const onDeleteCommands = (sortNo: number) => {
        state.commands.splice(sortNo, 1)
    }
    const onReplaceCommands = (a: number, b: number) => {
        const tmp = state.commands[a]
        state.commands[a] = state.commands[b]
        state.commands[b] = tmp
    }
    const onSpliceCommands = (sortNo: number, command: Crawler.Command.IBase) => {
        state.commands.splice(sortNo + 1, 0, command)
    }
    return {
        loadWorker,
        onCreateRedirectCommand,
        onUpdateRedirectCommand,
        onCreateClickCommand,
        onUpdateClickCommand,
        onCreateWriteCommand,
        onUpdateWriteCommand,
        onCommandContextMenu,
        onToggleCommandForm,
        onMoveAnyCommand,
        onDropInContainer,
        onDropOntoCard,
        onDropInContent,
        onDeleteCommands,
        onReplaceCommands,
        onSpliceCommands
    }
}
