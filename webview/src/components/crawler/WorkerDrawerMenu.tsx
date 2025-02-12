import _ from 'lodash'
import { computed, reactive, defineComponent, Teleport, type PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCrawlerStore } from '@/stores/crawler'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import commonUtil from '@/utils/common'
import type { Crawler } from '@/types/model'
import ModalDialog from '@/components/ui/ModalDialog'
import TextField from '@/components/form/TextField'
import WorkerForm from '@/components/crawler/WorkerForm'
import ScheduleForm from '@/components/crawler/ScheduleForm'
import './WorkerDrawerMenu.scoped.scss'
interface IWorkerDrawerMenu {
    keyword: string
}
export default defineComponent({
    name: 'WorkerDrawerMenu',
    components: {
        ModalDialog,
        TextField,
        WorkerForm,
        ScheduleForm
    },
    setup(props) {
        const route = useRoute()
        const router = useRouter()
        const crawlerStore = useCrawlerStore()
        const {
            onCreateWorker,
            onUpdateSchedule,
            onUpdateWorkerLabel,
            onToggleWorkerForm,
            onToggleScheduleForm,
            onWorkerContextMenu
        } = useCrawler(crawlerState)
        const state = reactive<IWorkerDrawerMenu>({
            keyword: ''
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
        const onClickItem = (event: Event, worker: Crawler.IWorker) => {
            router.push({ name: 'crawler-worker', params: { id: worker.id } })
        }
        return () => (
            <div class="worker-drawer-menu flex flex-col gap-2">
                <div class="worker-drawer-menu__header">
                    <text-field v-model={state.keyword} placeholder="자동화 항목을 검색합니다." />
                </div>
                <div
                    class="worker-drawer-menu__content"
                    onMouseup={(event: MouseEvent) => onWorkerContextMenu(event)}
                >
                    <ul class="worker-menu flex flex-col gap-2 w-full">
                        {filterItems.value.map((worker) => (
                            <li class="worker-menu__item">
                                <div
                                    class={{
                                        'worker-card flex flex-col justify-between box-shadow':
                                            true,
                                        'worker-card--active': route.params.id == worker.id
                                    }}
                                    onClick={(event: Event) => onClickItem(event, worker)}
                                    onMouseup={(event: MouseEvent) =>
                                        onWorkerContextMenu(event, worker)
                                    }
                                >
                                    <div class="flex justify-between items-center">
                                        <p>{worker.label}</p>
                                    </div>
                                    <div class="flex justify-end items-center">
                                        <button
                                            type="button"
                                            class="btn-schedule"
                                            onDblclick={(e) => onToggleScheduleForm(true, worker)}
                                        >
                                            <i class="mdi mdi-calendar-clock" />
                                            <span class="tooltip">스케줄링</span>
                                        </button>
                                    </div>
                                </div>
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
                        title="라벨 편집"
                        modelValue={crawlerState.workerForm.modal}
                        onUpdate:modelValue={onToggleWorkerForm}
                        persistent
                        hide-actions
                    >
                        <worker-form
                            {...crawlerState.workerForm.props}
                            onSubmit={onUpdateWorkerLabel}
                            onCancel={() => (crawlerState.workerForm.modal = false)}
                        />
                    </modal-dialog>
                    <modal-dialog
                        title={crawlerState.scheduleForm.title}
                        modelValue={crawlerState.scheduleForm.modal}
                        onUpdate:modelValue={onToggleScheduleForm}
                        persistent
                        hide-actions
                    >
                        <schedule-form
                            {...crawlerState.scheduleForm.props}
                            onSubmit={onUpdateSchedule}
                            onCancel={() => (crawlerState.scheduleForm.modal = false)}
                        />
                    </modal-dialog>
                </Teleport>
            </div>
        )
    }
})
