import { defineComponent, type PropType } from 'vue'
import dayjs from 'dayjs'
import DiaryPreview from '@/components/diary/DiaryPreview'
import '@/components/diary/DiaryCard.scoped.scss'
export default defineComponent({
    name: 'DiaryCard',
    components: {
        DiaryPreview
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
            <v-card class="diary-card" width={props.width} hover v-ripple>
                <v-row class="diary-card__filename bg-theme-1 px-2" no-gutters>
                    <v-col class="d-flex align-center fill-height text-truncate">
                        <p class="d2coding">{props.filename}</p>
                    </v-col>
                </v-row>
                <v-divider />
                <v-row class="diary-card__preview" no-gutters>
                    <v-col class="fill-height">
                        <diary-preview value={props.text} />
                    </v-col>
                </v-row>
                <v-divider />
                <v-row class="diary-card__created-at bg-theme-1 px-2" no-gutters>
                    <v-col class="d-flex flex-column justify-center text-truncate">
                        <p class="d2coding text-truncate">
                            작성일 {printDate(props.createdAt)}
                        </p>
                        <p class="d2coding text-truncate">
                            수정일 {printDate(props.updatedAt)}
                        </p>
                    </v-col>
                </v-row>
            </v-card>
        )
    }
})
