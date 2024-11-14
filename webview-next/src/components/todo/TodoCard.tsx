import _ from 'lodash'
import { unref, computed, defineComponent } from "vue"
import dayjs from 'dayjs'
import './TodoCard.scoped.scss'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'TodoCard',
    emits: ['remove'],
    props: {
        id: {
            type: [String],
            default: ''
        },
        title: {
            type: [String, null],
            default: null
        },
        status: {
            type: [Number],
            default: 0
        },
        startedAt: {
            type: [String, null],
            default: null
        },
        endedAt: {
            type: [String, null],
            default: null
        },
    },
    setup (props, { emit }) {
        const appStore = useAppStore()
        const getOption = computed(() => {
            const startedAt = dayjs(unref(props.startedAt))
            const endedAt = dayjs(unref(props.endedAt))
            const option: {
                period: string | null
                color?: string
            } = {
                period: null,
            }
            if (startedAt.isValid() && endedAt.isValid()) {
                const dDay = endedAt.diff(startedAt, 'day')
                if (dDay >= 0) {
                    option.period = `D-${dDay}`
                    option.color = appStore.scss('--failed-color')
                } 
                /** @TODO 상수로 변경할 것 */
                else if (props.status !== 2) {
                    option.period = '기한 만료'
                }
            }
            return option
        })
        const onBeforeRemove = (event: Event) => {
            event.stopPropagation()
            emit('remove', props)
        }
        return () => <v-card class="todo-card" outlined v-ripple>
            <v-row class="pt-2 px-2 flex-grow-0" no-gutters>
                <v-col cols="9" class="pl-2" align-self="center">
                    <h5 class="text-truncate">{ props.title }</h5>
                </v-col>
                <v-col cols="3" align="end">
                    <v-btn variant="text" density="comfortable" size="small" icon on:click={onBeforeRemove}>
                        <v-icon>mdi:mdi-close</v-icon>
                        <v-tooltip activator="parent" location="top">
                            <p class="text-white">삭제하기</p>
                        </v-tooltip>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="py-2 px-2 d-flex align-end" no-gutters>
                <v-col align="end">
                    {
                        unref(getOption).period &&
                        <v-chip
                            size="small"
                            color={unref(getOption).color}
                            variant="outlined"
                        >
                            { unref(getOption).period }
                        </v-chip>
                    }
                </v-col>
            </v-row>
        </v-card>
    }
})