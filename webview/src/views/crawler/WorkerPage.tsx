import _ from 'lodash'
import { computed, defineComponent, onMounted, type PropType } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useCrawlerStore } from '@/stores/crawler'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import type { Crawler } from '@/types/model'
import WorkerForm from '@/components/crawler/WorkerForm'
import WorkerContainer from '@/components/crawler/WorkerContainer'
import RedirectCard from '@/components/crawler/command/RedirectCard'
import ClickCard from '@/components/crawler/command/ClickCard'
import WriteCard from '@/components/crawler/command/WriteCard'
import './WorkerPage.scoped.scss'
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
        const appStore = useAppStore()
        const crawlerStore = useCrawlerStore()
        const { onRefreshCommands, onContextMenu, onDropInContent } = useCrawler(crawlerState)
        const onBack = () => {
            if (window.history && window.history.length > 1) {
                router.back()
                return
            }
            router.replace({ name: 'crawler' }).catch((e) => e)
        }
        const printWorkerLabel = computed(() => {
            const worker = crawlerStore.getWorkers.find((worker) => worker.id == props.id)
            if (!(worker && worker.id)) {
                return String()
            }
            return worker.label
        })
        const onRun = () => {
            console.log('run')
        }
        onBeforeRouteUpdate(() => {
            onRefreshCommands()
        })
        return () => (
            <article class="worker-page flex flex-col">
                <div class="worker-page__header flex justify-between items-center">
                    <div class="flex items-center">
                        <button
                            type="button"
                            class="btn-drawer flex justify-center items-center"
                            onClick={() => appStore.toggleDrawer()}
                        >
                            <i class="mdi mdi-robot"></i>
                        </button>
                        <button type="button" class="btn-nav">
                            <b>웹 자동화</b>
                        </button>
                        {props.id && (
                            <>
                                <i class="mdi mdi-chevron-right"></i>
                                <button type="button" class="btn-nav">
                                    <b>{printWorkerLabel.value}</b>
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        <button
                            type="button"
                            class="btn-back flex justify-center items-center"
                            onClick={onBack}
                        >
                            <i class="mdi mdi-arrow-left" />
                            <span class="tooltip tooltip-bottom">뒤로 가기</span>
                        </button>
                    </div>
                </div>
                <div
                    class="worker-page__content flex flex-col justify-between"
                    onMouseup={(e) => onContextMenu(e)}
                    onDrop={(e: DragEvent) => onDropInContent(e)}
                    onDragover={(e) => e.preventDefault()}
                >
                    <div class="worker flex flex-col items-start gap-4">
                        <b class="text-title">자동화 컨테이너</b>
                        <p class="text-desc">
                            카드를 선택 한 후 아래 컨테이너에 넣고 실행 버튼을 클릭해 주세요.
                        </p>
                        <worker-container />
                    </div>
                    <div class="command-panel flex items-start justify-start">
                        <write-card class="command-card" />
                        <click-card class="command-card" />
                        <redirect-card class="command-card" />
                    </div>
                </div>
                <div class="worker-page__actions flex justify-end items-center w-full gap-2">
                    <button class="btn-run col-span-1" onClick={onRun}>
                        실행하기
                    </button>
                </div>
            </article>
        )
    }
})
