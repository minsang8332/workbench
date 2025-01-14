import _ from 'lodash'
import { defineComponent, type PropType } from 'vue'
import { useCrawler } from '@/composables/useCrawler'
import type { Crawler } from '@/types/model'
import './RedirectCard.scoped.scss'
export default defineComponent({
    name: 'RedirectCard',
    emits: ['replace', 'splice'],
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
        const crawler = useCrawler(emit, { sortNo: props.sortNo })
        return () => (
            <div
                class="redirect-card flex flex-col"
                draggable
                onDragstart={(event) =>
                    props.create
                        ? crawler.onCreateRedirectCommand(event)
                        : crawler.onMoveCommand(event)
                }
                onDrop={crawler.onDropCommand}
            >
                <div class="redirect-card__header flex justify-between items-center gap-1">
                    <span>이동하기</span>
                    {_.isNumber(props.sortNo) && <span>{props.sortNo + 1}</span>}
                </div>
                <div class="redirect-card__content flex flex-col justify-center items-center gap-1">
                    <p class="text-url">{props.url}</p>
                </div>
            </div>
        )
    }
})
