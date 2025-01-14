import _ from 'lodash'
import { defineComponent, type PropType } from 'vue'
import { CRAWLER_COMMAND } from '@/costants/model'
import type { Crawler } from '@/types/model'
import './RedirectCard.scoped.scss'
export default defineComponent({
    name: 'RedirectCard',
    emits: ['drop'],
    props: {
        url: {
            type: String as PropType<Crawler.Command.IRedirect['url']>
        },
        timeout: {
            type: Number as PropType<Crawler.Command.IRedirect['timeout']>,
            default: 5000
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
                        name: CRAWLER_COMMAND.REDIRECT,
                        url: '',
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
                class="redirect-card flex flex-col"
                draggable
                onDragstart={(event) =>
                    props.create ? onCreateCommand(event) : onMoveCommand(event)
                }
                onDrop={onDropCommand}
            >
                <div class="redirect-card__header flex justify-start items-center">
                    <b>이동하기</b>
                </div>
                <div class="redirect-card__content flex justify-center items-center"></div>
            </div>
        )
    }
})
