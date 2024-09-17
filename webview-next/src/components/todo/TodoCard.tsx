import _ from 'lodash'
import { unref, computed, defineComponent } from "vue"
import dayjs from 'dayjs'
import './TodoCard.scoped.scss'
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
        const printPeriod = computed(() => {
            const startedAt = dayjs(unref(props.startedAt))
            const endedAt = dayjs(unref(props.endedAt))
            if (startedAt.isValid() && endedAt.isValid()) {
                return `${startedAt.format('YYYY.MM.DD')} ~ ${endedAt.format('YYYY.MM.DD')} 기간`
            }
            else if (endedAt.isValid()) {
                return `${endedAt.format('YYYY.MM.DD')} 까지`
            }
            return null
        })
        const onBeforeRemove = () => emit('remove', props)
        return () => <v-card class="todo-card" outlined v-ripple>
            <v-row class="py-2 pl-4 pr-2 flex-grow-0" no-gutters>
                <v-col align-self="center">
                    <h5>{ props.title }</h5>
                </v-col>
                <v-col align="end">
                    <v-btn size="small" variant="text" on:click={onBeforeRemove}>
                        <v-icon>fa-solid fa-close</v-icon>
                        <v-tooltip activator="parent" location="top">
                            <p class="text-white">삭제하기</p>
                        </v-tooltip>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col align-self="end">
                    <h5 class="period text-truncate">{ unref(printPeriod) }</h5>
                </v-col>
            </v-row>
        </v-card>
    }
})