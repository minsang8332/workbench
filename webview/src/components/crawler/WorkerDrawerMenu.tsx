import _ from 'lodash'
import dayjs from 'dayjs'
import {
    computed,
    reactive,
    defineComponent,
    inject,
    onBeforeMount,
    Teleport,
    type PropType
} from 'vue'
import { useRouter } from 'vue-router'
import { useCrawlerStore } from '@/stores/crawler'
import commonUtil from '@/utils/common'
import type { Crawler } from '@/types/model'
import ModalDialog from '@/components/ui/ModalDialog'
import TextField from '@/components/form/TextField'
import WorkerCard from '@/components/crawler/WorkerCard'
import WorkerForm from '@/components/crawler/WorkerForm'
import './WorkerDrawerMenu.scoped.scss'
import { useAppStore } from '@/stores/app'
interface IWorkerDrawerMenu {
    keyword: string
    workerForm: {
        modal: boolean
        props: Crawler.IWorker | null
    }
}
export default defineComponent({
    name: 'WorkerDrawerMenu',
    components: {
        ModalDialog,
        TextField,
        WorkerCard,
        WorkerForm
    },
    props: {
        id: {
            type: String as PropType<Crawler.IWorker['id']>,
            default: ''
        }
    },
    setup(props) {
        const $toast = inject('toast') as IToastPlugin
        const router = useRouter()
        const appStore = useAppStore()
        const crawlerStore = useCrawlerStore()
        const state = reactive<IWorkerDrawerMenu>({
            keyword: '',
            workerForm: {
                modal: false,
                props: null
            }
        })
        const filterItems = computed(() => {
            let items: Crawler.IWorker[] = []
            try {
                items = crawlerStore.getWorkers.filter((item: Crawler.IWorker) =>
                    commonUtil.searchByInitial(item.label, state.keyword)
                )
            } catch (e) {
                console.error(e)
            }
            return items
        })
        // 컨텍스트 메뉴 열기
        const onContextMenu = (event: MouseEvent, worker?: Crawler.IWorker) => {
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
                        onRefresh()
                        appStore.toggleMenu(false)
                    }
                }
            ]
            if (worker) {
                items = [
                    ...items,
                    {
                        name: 'edit-label-worker',
                        desc: '자동화 라벨 편집',
                        shortcut: 'E',
                        icon: 'mdi:mdi-file-edit-outline',
                        cb() {
                            onToggleForm(true, worker)
                            appStore.toggleMenu(false)
                        }
                    },
                    {
                        name: 'delete-worker',
                        desc: '자동화 삭제',
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
        const onRefresh = () => {
            crawlerStore
                .loadWorkers()
                .catch((e) => $toast.error(new Error('자동화 세트를 불러올 수 없습니다.')))
        }
        const onSubmitForm = ({
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
                    $toast.success('자동화 라벨을 수정 했습니다')
                })
                .catch(() => $toast.error(new Error('자동화 라벨을 수정 할 수 없습니다')))
                .finally(onRefresh)
        }
        const onCancelForm = () => {
            onRefresh()
            state.workerForm.modal = false
        }
        const onToggleForm = (modal: boolean, worker: Crawler.IWorker) => {
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
        const onCreateWorker = () => {
            crawlerStore
                .saveWorker({
                    label: `자동화 세트 ${dayjs().format('HHmm')}`,
                    commands: []
                })
                .then(() => $toast.success('자동화를 생성 했습니다'))
                .catch(() => $toast.error(new Error('자동화를 생성 할 수 없습니다')))
                .finally(onCancelForm)
        }
        const onDeleteWorker = (worker: Crawler.IWorker) => {
            crawlerStore
                .deleteWorker(worker.id)
                .then(() => $toast.success(`${worker.label ?? '자동화'} 을/를 제거 했습니다`))
                .catch(() =>
                    $toast.error(new Error(`${worker.label ?? '자동화'} 을/를 제거 할 수 없습니다`))
                )
                .finally(onRefresh)
        }
        const onRouteWorkerCard = (event: Event, worker: Crawler.IWorker) => {
            router.push({ name: 'worker', params: { id: worker.id } })
        }
        onBeforeMount(() => {
            onRefresh()
        })
        return () => (
            <div class="worker-drawer-menu flex flex-col gap-2">
                <div class="worker-drawer-menu__header">
                    <text-field v-model={state.keyword} placeholder="자동화 항목을 검색합니다." />
                </div>
                <div
                    class="worker-drawer-menu__content"
                    onMouseup={(event: MouseEvent) => onContextMenu(event)}
                >
                    <ul class="worker-menu flex flex-col gap-2 w-full">
                        {filterItems.value.map((worker) => (
                            <li class="worker-menu__item flex justify-start items-center gap-2">
                                <worker-card
                                    {...worker}
                                    active={props.id == worker.id}
                                    onClick={(event: Event) => onRouteWorkerCard(event, worker)}
                                    onMouseup={(event: MouseEvent) => onContextMenu(event, worker)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div class="worker-drawer-menu__actions">
                    <button type="button" class="btn-create" onClick={onCreateWorker}>
                        <b>자동화 생성</b>
                    </button>
                </div>
                <Teleport to="body">
                    <modal-dialog
                        title="자동화 라벨 편집기"
                        modelValue={state.workerForm.modal}
                        onUpdate:modelValue={onToggleForm}
                        persistent
                        hide-actions
                    >
                        <worker-form
                            {...state.workerForm.props}
                            onSubmit={onSubmitForm}
                            onCancel={onCancelForm}
                        />
                    </modal-dialog>
                </Teleport>
            </div>
        )
    }
})
