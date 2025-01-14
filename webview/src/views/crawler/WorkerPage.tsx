import _ from 'lodash'
import { computed, defineComponent, onBeforeMount, reactive, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useCrawlerStore } from '@/stores/crawler'
import WorkerForm from '@/components/crawler/WorkerForm'
import RedirectCard from '@/components/crawler/command/RedirectCard'
import ClickCard from '@/components/crawler/command/ClickCard'
import WriteCard from '@/components/crawler/command/WriteCard'
import { CRAWLER_COMMAND } from '@/costants/model'
import type { Crawler } from '@/types/model'
import './WorkerPage.scoped.scss'
interface ICrawlerPageState {
    commands: Crawler.IWorker['commands']
}
export default defineComponent({
    name: 'CrawlerPage',
    components: {
        WorkerForm,
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
    setup(props) {
        const router = useRouter()
        const appStore = useAppStore()
        const crawlerStore = useCrawlerStore()
        const state = reactive<ICrawlerPageState>({
            commands: []
        })
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
        const initWorkerCommands = () => {
            const worker = crawlerStore.getWorkers.find((worker) => worker.id == props.id)
            if (!(worker && worker.id)) {
                return String()
            }
            state.commands = worker.commands
        }
        const onDropInWorkerContainer = (event: DragEvent) => {
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
        const onDropOutWorkerContainer = (event: DragEvent) => {
            event.preventDefault()
            event.stopPropagation()
            if (!(event && event.dataTransfer)) {
                return
            }
            const data = event.dataTransfer.getData('move')
            if (data) {
                const command = JSON.parse(data)
                if (_.isNumber(command.sortNo)) {
                    state.commands.splice(command.sortNo, 1)
                }
            }
        }
        const onReplaceCommand = (a: number, b: number) => {
            const tmp = state.commands[a]
            state.commands[a] = state.commands[b]
            state.commands[b] = tmp
        }
        const onSpliceCommand = (sortNo: number, command: Crawler.Command.IBase) => {
            state.commands.splice(sortNo + 1, 0, command)
        }
        onBeforeMount(() => {
            initWorkerCommands()
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
                    onDrop={onDropOutWorkerContainer}
                    onDragover={(e) => {
                        e.preventDefault()
                    }}
                >
                    <div class="worker flex flex-col items-start gap-4">
                        <b class="text-title">자동화 컨테이너</b>
                        <p class="text-desc">
                            카드를 선택 한 후 아래 컨테이너에 넣고 실행 버튼을 클릭해 주세요.
                        </p>
                        <ul
                            class="worker-container flex justify-start items-center box-shadow gap-2"
                            onDragover={(e) => {
                                e.preventDefault()
                            }}
                            onDrop={onDropInWorkerContainer}
                        >
                            {state.commands.map((commnad, i) => {
                                let component = null
                                switch (commnad.name) {
                                    case CRAWLER_COMMAND.REDIRECT:
                                        component = (
                                            <redirect-card
                                                class="command-card"
                                                {...commnad}
                                                sort-no={i}
                                                onReplace={onReplaceCommand}
                                                onSplice={onSpliceCommand}
                                            />
                                        )
                                        break
                                    case CRAWLER_COMMAND.CLICK:
                                        component = (
                                            <click-card
                                                class="command-card"
                                                {...commnad}
                                                sort-no={i}
                                                onReplace={onReplaceCommand}
                                                onSplice={onSpliceCommand}
                                            />
                                        )
                                        break
                                    case CRAWLER_COMMAND.WRITE:
                                        component = (
                                            <write-card
                                                class="command-card"
                                                {...commnad}
                                                sort-no={i}
                                                onReplace={onReplaceCommand}
                                                onSplice={onSpliceCommand}
                                            />
                                        )
                                        break
                                }
                                return component
                            })}
                        </ul>
                    </div>
                    <div class="command-panel flex items-start justify-start">
                        <write-card class="command-card" create />
                        <click-card class="command-card" create />
                        <redirect-card class="command-card" create />
                    </div>
                </div>
                <div class="worker-page__actions flex items-center"></div>
            </article>
        )
    }
})
