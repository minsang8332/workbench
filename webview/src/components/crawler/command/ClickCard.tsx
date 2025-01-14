import _ from 'lodash'
import { defineComponent, type PropType } from 'vue'
import { CRAWLER_COMMAND } from '@/costants/model'
import type { Crawler } from '@/types/model'
import './ClickCard.scoped.scss'
export default defineComponent({
    name: 'ClickCard',
    emits: ['drop'],
    props: {
        selector: {
            type: String as PropType<Crawler.Command.IClick['selector']>,
            default: ''
        },
        sortNo: {
            type: Number as PropType<number | null>,
            default: null
        },
        create: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props, { emit }) {
        const onCreateCommand = (event: DragEvent) => {
            event.stopPropagation()
            if (event.dataTransfer) {
                event.dataTransfer.setData(
                    'create-command',
                    JSON.stringify({
                        name: CRAWLER_COMMAND.CLICK,
                        selector: '',
                        timeout: 5000
                    })
                )
            }
        }
        const onMoveCommand = (event: DragEvent) => {
            event.stopPropagation()
            if (event.dataTransfer) {
                event.dataTransfer.setData(
                    'move-command',
                    JSON.stringify({
                        sortNo: props.sortNo
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
            const data = event.dataTransfer.getData('move-command')
            if (_.isEmpty(data)) {
                return
            }
            const command = JSON.parse(data)
            emit('drop', props.sortNo, command.sortNo)
        }
        return () => (
            <div
                class="click-card flex flex-col"
                draggable
                onDragstart={(event) =>
                    props.create ? onCreateCommand(event) : onMoveCommand(event)
                }
                onDrop={onDropCommand}
            >
                <div class="click-card__header flex justify-start items-center">
                    <b>클릭하기</b>
                </div>
                <div class="click-card__content flex justify-center items-center"></div>
            </div>
        )
    }
})
