import _ from 'lodash'
import dayjs from 'dayjs'
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CRAWLER_COMMAND } from '@/costants/model'
import { useAppStore } from '@/stores/app'
import { useCrawlerStore } from '@/stores/crawler'
import { useApp } from './useApp'
import type { Crawler } from '@/types/model'
interface ICrawlerState {
    commands: Crawler.IWorker['commands']
    commandForm: {
        modal: boolean
        props: (Crawler.Command.IBase & { sortNo: number }) | null
    }
    workerForm: {
        modal: boolean
        props: Crawler.IWorker | null
    }
    scheduleForm: {
        title: string | null
        modal: boolean
        props: Crawler.ISchedule | null
    }
}
export const crawlerState = reactive(<ICrawlerState>{
    commands: [],
    commandForm: {
        modal: false,
        props: null
    },
    workerForm: {
        modal: false,
        props: null
    },
    scheduleForm: {
        title: null,
        modal: false,
        props: null
    },
    validates: []
})
export const useCrawler = (state: ICrawlerState) => {
    // State
    const router = useRouter()
    const route = useRoute()
    const appStore = useAppStore()
    const crawlerStore = useCrawlerStore()
    const { alert } = useApp()
    // Getters
    const workerId = computed(() => _.toString(route.params.id))
    // Actions
    const onRun = () => {
        crawlerStore
            .saveWorkerCommands({
                id: workerId.value,
                commands: crawlerState.commands
            })
            .then(() =>
                crawlerStore
                    .runWorker(workerId.value)
                    .then((response) => alert.success(response.message))
                    .catch((e) => alert.error(e))
                    .finally(onLoadHistories)
                    .finally(() => router.push({ name: 'crawler' }))
            )
            .catch((e) => alert.error(e))
    }
    const onLoadWorker = () => {
        crawlerStore
            .loadWorkers()
            .then(() => {
                const workers = crawlerStore.getWorkers
                if (!(workers && workers.length > 0)) {
                    router.replace({ name: 'crawler' })
                    return
                }
                const worker = workers.find((worker) => worker.id == workerId.value)
                if (!(worker && worker.id)) {
                    crawlerState.commands = []
                    router.replace({ name: 'crawler' })
                    return
                }
                crawlerState.commands = [...worker.commands]
            })
            .catch((e) => {
                console.error(e)
                alert.error(new Error('자동화 세트를 불러올 수 없습니다.'))
            })
    }
    const onLoadHistories = () => {
        crawlerStore.loadHistories().catch((e) => alert.error(e))
    }
    const onCreateWorker = () => {
        crawlerStore
            .saveWorker({
                label: `자동화 세트 ${dayjs().format('HHmm')}`,
                commands: []
            })
            .then(() => alert.success('자동화를 생성 했습니다'))
            .catch(() => alert.error(new Error('자동화를 생성 할 수 없습니다')))
            .finally(onLoadWorker)
    }
    const onUpdateWorkerLabel = ({
        id,
        label
    }: {
        id: Crawler.IWorker['id']
        label: Crawler.IWorker['label']
    }) => {
        crawlerStore
            .saveWorkerLabel({ id, label })
            .then(() => {
                state.workerForm.modal = false
                alert.success('자동화 라벨을 수정 했습니다')
            })
            .catch(() => alert.error(new Error('자동화 라벨을 수정 할 수 없습니다')))
            .finally(() => (state.workerForm.modal = false))
    }
    const onUpdateSchedule = (payload: {
        id?: Crawler.ISchedule['id']
        workerId: Crawler.ISchedule['workerId']
        active: Crawler.ISchedule['active']
        expression: Crawler.ISchedule['expression']
    }) => {
        crawlerStore
            .saveSchedule(payload)
            .then((response) => alert.success(response.message))
            .then(() => onToggleScheduleForm(false))
            .catch((e) => alert.error(e))
    }
    const onDeleteWorker = (worker: Crawler.IWorker) => {
        crawlerStore
            .deleteWorker(worker.id)
            .then(() => alert.success(`${worker.label ?? '자동화'} 을/를 제거 했습니다`))
            .catch(() =>
                alert.error(new Error(`${worker.label ?? '자동화'} 을/를 제거 할 수 없습니다`))
            )
            .finally(onLoadWorker)
    }
    // Form
    const onToggleWorkerForm = (modal: boolean, worker: Crawler.IWorker) => {
        if (!_.isBoolean(modal)) {
            return
        }
        if (modal && worker) {
            state.workerForm.props = worker
        } else {
            state.workerForm.props = null
        }
        state.workerForm.modal = modal
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
    const onToggleScheduleForm = (modal: boolean, worker?: Crawler.IWorker) => {
        if (!_.isBoolean(modal)) {
            return
        }
        if (modal && worker) {
            state.scheduleForm.title = worker.label
            // state.scheduleForm.props =
        } else {
            state.scheduleForm.title = null
            state.scheduleForm.props = null
        }
        state.scheduleForm.modal = modal
    }
    // ContextMenu
    const onWorkerContextMenu = (event: MouseEvent, worker?: Crawler.IWorker) => {
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
                    onLoadWorker()
                    appStore.toggleMenu(false)
                }
            }
        ]
        if (worker) {
            items = [
                ...items,
                {
                    name: 'edit-label-worker',
                    desc: '스케줄링',
                    shortcut: 'E',
                    icon: 'mdi:mdi-file-edit-outline',
                    cb() {
                        onToggleScheduleForm(true, worker)
                        appStore.toggleMenu(false)
                    }
                },
                {
                    name: 'edit-label-worker',
                    desc: '이름 바꾸기',
                    shortcut: 'E',
                    icon: 'mdi:mdi-file-edit-outline',
                    cb() {
                        onToggleWorkerForm(true, worker)
                        appStore.toggleMenu(false)
                    }
                },
                {
                    name: 'delete-worker',
                    desc: '삭제하기',
                    shortcut: 'D',
                    icon: 'mdi:mdi-trash-can-outline',
                    cb() {
                        onDeleteWorker(worker)
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
                    onLoadWorker()
                    appStore.toggleMenu(false)
                }
            },
            {
                name: 'save',
                desc: '저장하기',
                shortcut: 'R',
                icon: 'mdi:mdi-refresh',
                cb() {
                    crawlerStore
                        .saveWorkerCommands({
                            id: workerId.value,
                            commands: crawlerState.commands
                        })
                        .then(() => alert.success('정상적으로 저장되었습니다.'))
                        .catch(() => alert.error(new Error('저장 할 수 없습니다.')))
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
    const onHistoryContextMenu = (event: MouseEvent) => {
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
                    onLoadHistories()
                    appStore.toggleMenu(false)
                }
            }
        ]
        appStore.toggleMenu(true, {
            pageX: event.pageX,
            pageY: event.pageY,
            items
        })
    }
    // Card
    const onCreateRedirectCommand = (event: DragEvent) => {
        event.stopPropagation()
        if (event.dataTransfer) {
            event.dataTransfer.setData(
                'create',
                JSON.stringify({
                    name: CRAWLER_COMMAND.REDIRECT,
                    url: '',
                    timeout: 5000,
                    validate: false
                })
            )
        }
    }
    const onUpdateRedirectCommand = (
        sortNo: number,
        url: Crawler.Command.IRedirect['url'],
        timeout: Crawler.Command.IRedirect['timeout'],
        validate: boolean
    ) => {
        state.commands[sortNo] = {
            name: CRAWLER_COMMAND.REDIRECT,
            url,
            timeout: _.toNumber(timeout),
            validate
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
                    timeout: 5000,
                    validate: false
                })
            )
        }
    }
    const onUpdateClickCommand = (
        sortNo: number,
        selector: Crawler.Command.IClick['selector'],
        timeout: Crawler.Command.IClick['timeout'],
        validate: boolean
    ) => {
        state.commands[sortNo] = {
            name: CRAWLER_COMMAND.CLICK,
            selector,
            timeout: _.toNumber(timeout),
            validate
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
                    timeout: 5000,
                    validate: false
                })
            )
        }
    }
    const onUpdateWriteCommand = (
        sortNo: number,
        selector: Crawler.Command.IWrite['selector'],
        text: Crawler.Command.IWrite['text'],
        timeout: Crawler.Command.IWrite['timeout'],
        validate: boolean
    ) => {
        state.commands[sortNo] = {
            name: CRAWLER_COMMAND.WRITE,
            selector,
            text,
            timeout: _.toNumber(timeout),
            validate
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
        onRun,
        onLoadWorker,
        onLoadHistories,
        onCreateWorker,
        onUpdateWorkerLabel,
        onUpdateSchedule,
        onDeleteWorker,
        onToggleWorkerForm,
        onToggleScheduleForm,
        onToggleCommandForm,
        onWorkerContextMenu,
        onCommandContextMenu,
        onHistoryContextMenu,
        onCreateRedirectCommand,
        onUpdateRedirectCommand,
        onCreateClickCommand,
        onUpdateClickCommand,
        onCreateWriteCommand,
        onUpdateWriteCommand,
        onMoveAnyCommand,
        onDropInContainer,
        onDropOntoCard,
        onDropInContent,
        onDeleteCommands,
        onReplaceCommands,
        onSpliceCommands
    }
}
