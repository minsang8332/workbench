import { defineComponent, type PropType } from 'vue'
import dayjs from 'dayjs'
import MarkdownPreview from '@/components/ui/MarkdownPreview'
import '@/components/diary/DiaryCard.scoped.scss'
export default defineComponent({
    name: 'DiaryCard',
    components: {
        MarkdownPreview
    },
    props: {
        filename: {
            type: [String, null] as PropType<string | null>,
            default: null
        },
        text: {
            type: [String, null] as PropType<string | null>,
            default: null
        },
        createdAt: {
            type: [Date, null] as PropType<Date | null>,
            default: null
        },
        updatedAt: {
            type: [Date, null] as PropType<Date | null>,
            default: null
        },
        width: {
            type: [String, null] as PropType<string | null>,
            default: '100%'
        }
    },
    setup(props) {
        const printDate = (ts: Date | null) => {
            let print = null
            if (ts) {
                const date = dayjs(new Date(ts))
                if (date.isValid()) {
                    print = date.format('YYYY.MM.DD HH:mm:ss')
                }
            }
            return print
        }
        return () => (
            <div class="diary-card">
                <div class="diary-card__header flex justify-between items-center px-2">
                    <p>{props.filename}</p>
                </div>
                <div class="diary-card__content">
                    <markdown-preview value={props.text} />
                </div>
                <div class="diary-card__footer flex flex-start flex-col justify-evenly px-2">
                    <p>작성일 {printDate(props.createdAt)}</p>
                    <p>수정일 {printDate(props.updatedAt)}</p>
                </div>
            </div>
        )
    }
})
