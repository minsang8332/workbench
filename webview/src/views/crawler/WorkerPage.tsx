import _ from 'lodash'
import { computed, defineComponent, onBeforeMount, type PropType } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCrawlerStore } from '@/stores/crawler'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import type { Crawler } from '@/types/model'
import WorkerForm from '@/components/crawler/WorkerForm'
import WorkerContainer from '@/components/crawler/WorkerContainer'
import RedirectCard from '@/components/crawler/command/RedirectCard'
import ClickCard from '@/components/crawler/command/ClickCard'
import WriteCard from '@/components/crawler/command/WriteCard'
import './WorkerPage.scoped.scss'
import { useApp } from '@/composables/useApp'
export default defineComponent({
    name: 'WorkerPage',
    components: {
        WorkerForm,
        WorkerContainer,
        RedirectCard,
        ClickCard,
        WriteCard
    },
    props: {
        id: {
            type: String as PropType<Crawler.IWorker['id']>,
            default: ''
        }
    },
    setup(props, { emit }) {
        const router = useRouter()
        const { $toast } = useApp()
        const crawlerStore = useCrawlerStore()
        const { getWorkers } = storeToRefs(crawlerStore)
        const { loadWorker, onCommandContextMenu, onDropInContent } = useCrawler(crawlerState)
        const printLabel = computed(() => {
            const worker = getWorkers.value.find((worker) => worker.id == props.id)
            if (!(worker && worker.id)) {
                return String()
            }
            return worker.label
        })
        const onSave = async () => {
            try {
                const id = props.id
                if (!_.isString(id)) {
                    $toast.error(new Error('자동화 세트를 선택해 주세요.'))
                    return
                }
                await crawlerStore.saveWorkerCommands({
                    id,
                    commands: crawlerState.commands
                })
                $toast.success('자동화 세트를 저장했습니다.')
                await crawlerStore.loadWorkers
            } catch (e) {
                console.error(e)
                $toast.error(new Error('자동화 세트를 저장 할 수 없습니다.'))
            }
        }
        const onRun = async () => {
            await onSave()
            await crawlerStore
                .runWorker(props.id)
                .then((response) => $toast.success(response.message))
                .catch((e) => $toast.error(e))
        }
        onBeforeRouteUpdate(() => {
            loadWorker()
        })
        onBeforeMount(() => {
            loadWorker()
        })
        return () => (
            <article class="worker-page flex flex-col">
                <div
                    class="worker-page__content flex flex-col justify-between"
                    onMouseup={(e) => onCommandContextMenu(e)}
                    onDrop={(e: DragEvent) => onDropInContent(e)}
                    onDragover={(e) => e.preventDefault()}
                >
                    <div class="worker flex flex-col gap-4">
                        <b class="text-title">{printLabel.value}</b>
                        <p class="text-desc">
                            카드를 선택 한 후 아래 컨테이너에 넣고 [실행하기] 버튼을 클릭해 주세요.
                            컨테이너 상의 명령대로 브라우저가 동작하게 됩니다.
                        </p>
                        <worker-container />
                    </div>
                    <div class="worker-panel">
                        <write-card class="command-card" />
                        <click-card class="command-card" />
                        <redirect-card class="command-card" />
                    </div>
                </div>
                <div class="worker-page__actions flex justify-end items-center w-full gap-2">
                    <button class="btn-run col-span-1" onClick={onRun}>
                        실행하기
                    </button>
                    <button class="btn-save" onClick={onSave}>
                        <i class="mdi mdi-content-save"></i>
                        <span class="tooltip">저장하기</span>
                    </button>
                </div>
            </article>
        )
    }
})
