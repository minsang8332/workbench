import { defineComponent, type PropType } from 'vue'
import dayjs from 'dayjs'
import '@/components/markdown/MdPreviewCard.scoped.scss'
export default defineComponent({
    name: 'MdPreviewCard',
    props: {
        title: {
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
            <v-card class="md-preview-card" width={props.width} outlined shaped v-ripple>
                <v-row class="mpc-row-title px-2" no-gutters>
                    <v-col class="d-flex align-center fill-height text-truncate">
                        <p class="mpc-text-title d2coding">{props.title}</p>
                    </v-col>
                </v-row>
                <v-divider />
                <v-row class="mpc-row-preview" no-gutters>
                    <v-col class="fill-height">
                        <md-preview ref="preview" text={props.text} />
                    </v-col>
                </v-row>
                <v-divider />
                <v-row class="mpc-row-created-at px-2" no-gutters>
                    <v-col class="d-flex flex-column justify-center text-truncate">
                        <p class="mpc-text-date d2coding text-truncate">
                            작성일
                            {printDate(props.createdAt)}
                        </p>
                        <p class="mpc-text-date d2coding text-truncate">
                            수정일
                            {printDate(props.updatedAt)}
                        </p>
                    </v-col>
                </v-row>
            </v-card>
        )
    }
})
