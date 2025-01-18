import _ from 'lodash'
import {
    ref,
    computed,
    defineComponent,
    Teleport,
    onBeforeMount,
    onMounted,
    onUnmounted,
    type PropType
} from 'vue'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import { CRAWLER_COMMAND } from '@/costants/model'
import type { Crawler } from '@/types/model'
import ModalDialog from '@/components/ui/ModalDialog'
import RedirectCard from '@/components/crawler/command/RedirectCard'
import ClickCard from '@/components/crawler/command/ClickCard'
import WriteCard from '@/components/crawler/command/WriteCard'
import './WorkerContainer.scoped.scss'
export default defineComponent({
    name: 'WorkerContainer',
    components: {
        ModalDialog,
        RedirectCard,
        ClickCard,
        WriteCard
    },
    setup(props) {
        const { onDropInContainer, onContextMenu, onToggleCommandForm } = useCrawler(crawlerState)
        const scrolling = ref(false)
        const containerRef = ref<HTMLDivElement>()
        const scrollX = ref(0)
        const scrollLeft = ref(0)
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
                }
            }
            return <component is={component} {...crawlerState.commandForm.props} form />
        })
        const renderCommandCards = computed(() =>
            crawlerState.commands.map((commnad, i) => {
                let component = null
                switch (commnad.name) {
                    case CRAWLER_COMMAND.REDIRECT:
                        component = RedirectCard
                        break
                    case CRAWLER_COMMAND.CLICK:
                        component = ClickCard
                        break
                    case CRAWLER_COMMAND.WRITE:
                        component = WriteCard
                }
                return (
                    <div class="h-full" onMouseup={(e: MouseEvent) => onContextMenu(e, i)}>
                        <component is={component} {...commnad} sort-no={i} />
                    </div>
                )
            })
        )
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
        onMounted(() => {
            onAddWheelListener()
        })
        onUnmounted(() => {
            onRemoveWheelListener()
        })
        return () => (
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
        )
    }
})
