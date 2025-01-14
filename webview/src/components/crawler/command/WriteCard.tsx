import _ from 'lodash'
import { defineComponent, type PropType } from 'vue'
import { useCrawler } from '@/composables/useCrawler'
import type { Crawler } from '@/types/model'
import './WriteCard.scoped.scss'
export default defineComponent({
    name: 'WriteCard',
    emits: ['replace', 'splice'],
    props: {
        selector: {
            type: String as PropType<Crawler.Command.IClick['selector']>,
            default: ''
        },
        text: {
            type: String as PropType<Crawler.Command.IRedirect['url']>
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
        const crawler = useCrawler(emit, { sortNo: props.sortNo })
        return () => (
            <div
                class="write-card flex flex-col"
                draggable
                onDragstart={(event) =>
                    props.create
                        ? crawler.onCreateWriteCommand(event)
                        : crawler.onMoveCommand(event)
                }
                onDrop={crawler.onDropCommand}
            >
                <div class="write-card__header flex justify-between items-center gap-1">
                    <span>입력하기</span>
                    {_.isNumber(props.sortNo) && <span>{props.sortNo + 1}</span>}
                </div>
                <div class="write-card__content flex justify-center items-center"></div>
            </div>
        )
    }
})
