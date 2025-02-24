import _ from 'lodash'
import { ref, computed, defineComponent, onBeforeMount, Teleport, type PropType } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useApp } from '@/composables/useApp'
import { useCrawlerStore } from '@/stores/crawler'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import { CRAWLER_COMMAND } from '@/costants/model'
import type { Crawler } from '@/types/model'
import ModalDialog from '@/components/ui/ModalDialog'
import WorkerForm from '@/components/crawler/WorkerForm'
import RedirectCard from '@/components/crawler/command/RedirectCard'
import ClickCard from '@/components/crawler/command/ClickCard'
import WriteCard from '@/components/crawler/command/WriteCard'
import ScrapCard from '@/components/crawler/command/ScrapCard'
import './WorkerPage.scoped.scss'
export default defineComponent({
    name: 'WorkerPage',
    components: {
        ModalDialog,
        WorkerForm,
        RedirectCard,
        ClickCard,
        WriteCard,
        ScrapCard
    },
    props: {
        id: {
            type: String as PropType<Crawler.IWorker['id']>,
            default: '',
            required: true
        }
    },
    setup(props, { emit }) {
        // composables
        const crawlerStore = useCrawlerStore()
        const { alert } = useApp()
        const { getWorkers } = storeToRefs(crawlerStore)
        const {
            onRun,
            onLoadWorker,
            onToggleCommandForm,
            onCommandContextMenu,
            onCreateClickCommand,
            onCreateRedirectCommand,
            onCreateWriteCommand,
            onCreateScrapCommand,
            onDropInContent,
            onDropInContainer,
            onDropOntoCard,
            onMoveAnyCommand
        } = useCrawler(crawlerState)
        // State
        const scrolling = ref(false)
        const containerRef = ref<HTMLDivElement>()
        const scrollX = ref(0)
        const scrollLeft = ref(0)
        // Computed
        const printLabel = computed(() => {
            const worker = getWorkers.value.find((worker) => worker.id == props.id)
            if (!(worker && worker.id)) {
                return String()
            }
            return worker.label
        })
        const validate = computed(
            () =>
                crawlerState.commands.length > 0 &&
                crawlerState.commands.every((command) => command.validate === true)
        )
        const renderCommandForm = computed(() => {
            let component = null
            if (crawlerState.commandForm.props) {
                switch (crawlerState.commandForm.props.name) {
                    case CRAWLER_COMMAND.REDIRECT:
                        component = RedirectCard
                        break
                    case CRAWLER_COMMAND.CLICK:
                        component = ClickCard
                        break
                    case CRAWLER_COMMAND.WRITE:
                        component = WriteCard
                        break
                    case CRAWLER_COMMAND.SCRAP:
                        component = ScrapCard
                        break
                }
            }
            return <component is={component} {...crawlerState.commandForm.props} form />
        })
        const renderCommandCards = computed(() =>
            crawlerState.commands.map((command, sortNo) => {
                let component = null
                switch (command.name) {
                    case CRAWLER_COMMAND.REDIRECT:
                        component = RedirectCard
                        break
                    case CRAWLER_COMMAND.CLICK:
                        component = ClickCard
                        break
                    case CRAWLER_COMMAND.WRITE:
                        component = WriteCard
                        break
                    case CRAWLER_COMMAND.SCRAP:
                        component = ScrapCard
                        break
                }
                return (
                    <component
                        is={component}
                        {...command}
                        sort-no={sortNo}
                        draggable
                        onDragover={(event: DragEvent) => event.preventDefault()}
                        onDragstart={(event: DragEvent) =>
                            _.isNumber(sortNo)
                                ? onMoveAnyCommand(event, sortNo)
                                : onCreateWriteCommand(event)
                        }
                        onDrop={(event: DragEvent) => onDropOntoCard(event, sortNo)}
                        onMouseup={(event: MouseEvent) => onCommandContextMenu(event, sortNo)}
                        onDblclick={(event: MouseEvent) => onToggleCommandForm(true, sortNo)}
                    />
                )
            })
        )
        const onBeforeRun = () => {
            if (!validate.value) {
                alert.error(new Error('컨테이너 카드가 유효한지 확인해 주세요 !'))
                return
            }
            onRun()
        }
        const onMousedown = (event: MouseEvent) => {
            if (containerRef.value) {
                scrolling.value = true
                scrollX.value = event.pageX - containerRef.value.offsetLeft
                scrollLeft.value = containerRef.value.scrollLeft
            }
        }
        const onMousemove = (event: MouseEvent) => {
            event.preventDefault()
            if (containerRef.value && scrolling.value === true) {
                const x = event.pageX - containerRef.value.offsetLeft
                const walk = x - scrollX.value
                containerRef.value.scrollLeft = scrollLeft.value - walk
            }
        }
        const onMouseleave = () => {
            scrolling.value = false
        }
        const onWheel = (event: WheelEvent) => {
            event.preventDefault()
            if (containerRef.value) {
                containerRef.value.scrollTo({
                    top: 0,
                    left: containerRef.value.scrollLeft + event.deltaY * 2,
                    behavior: 'smooth'
                })
            }
        }
        const onAddWheelListener = () => {
            if (containerRef.value) {
                containerRef.value.addEventListener('wheel', onWheel, { passive: false })
            }
        }
        const onRemoveWheelListener = () => {
            if (containerRef.value) {
                containerRef.value.removeEventListener('wheel', onWheel)
            }
        }
        onBeforeRouteUpdate(() => {
            onAddWheelListener()
            onLoadWorker()
        })
        onBeforeMount(() => {
            onRemoveWheelListener()
            onLoadWorker()
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
                        <div
                            ref={containerRef}
                            class="worker-container flex items-center gap-2 box-shadow"
                            onDragover={(e) => e.preventDefault()}
                            onDrop={onDropInContainer}
                            onMousedown={onMousedown}
                            onMousemove={onMousemove}
                            onMouseup={onMouseleave}
                            onMouseleave={onMouseleave}
                        >
                            {renderCommandCards.value}
                            <Teleport to="body">
                                <modal-dialog
                                    modelValue={crawlerState.commandForm.modal}
                                    onUpdate:modelValue={onToggleCommandForm}
                                    persistent
                                    hide-actions
                                >
                                    {renderCommandForm.value}
                                </modal-dialog>
                            </Teleport>
                        </div>
                    </div>
                    <div class="worker-panel">
                        <redirect-card
                            class="command-card"
                            draggable
                            onDragover={(event: DragEvent) => event.preventDefault()}
                            onDragstart={(event: DragEvent) => onCreateRedirectCommand(event)}
                        />
                        <click-card
                            class="command-card"
                            draggable
                            onDragover={(event: DragEvent) => event.preventDefault()}
                            onDragstart={(event: DragEvent) => onCreateClickCommand(event)}
                        />
                        <write-card
                            class="command-card"
                            draggable
                            onDragover={(event: DragEvent) => event.preventDefault()}
                            onDragstart={(event: DragEvent) => onCreateWriteCommand(event)}
                        />
                        <scrap-card
                            class="command-card"
                            draggable
                            onDragover={(event: DragEvent) => event.preventDefault()}
                            onDragstart={(event: DragEvent) => onCreateScrapCommand(event)}
                        />
                    </div>
                </div>
                <div class="worker-page__actions flex justify-end items-center w-full gap-2">
                    <button
                        class="btn-run col-span-1"
                        onClick={onBeforeRun}
                        disabled={!validate.value}
                    >
                        실행하기
                    </button>
                </div>
            </article>
        )
    }
})
