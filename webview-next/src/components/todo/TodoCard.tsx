import _ from 'lodash'
import { unref, computed, defineComponent } from 'vue'
import dayjs from 'dayjs'
import './TodoCard.scoped.scss'
interface ITodoCard {
    dDay?: number
}
enum TodoPeriod {
    EXPIRED = '기한만료'
}
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
        }
    },
    setup(props, { emit }) {
        const getProps = computed(() => {
            const startedAt = dayjs(unref(props.startedAt))
            const endedAt = dayjs(unref(props.endedAt))
            const value: ITodoCard = {}
            if (startedAt.isValid() && endedAt.isValid()) {
                const dDay = endedAt.startOf('day').diff(dayjs(new Date()).startOf('day'), 'day')
                value.dDay = dDay
            }
            return value
        })
        const printPeriod = computed(() => {
            let text = null
            const dDay = getProps.value.dDay
            if (_.isNumber(dDay)) {
                text = `${dDay}일 전`
                if (dDay < 0) {
                    text = TodoPeriod.EXPIRED
                }
            }
            return text
        })
        const classListPeriod = computed(() => {
            const classList = ['period']
            const dDay = getProps.value.dDay
            if (_.isNumber(dDay) && dDay > 0) {
                classList.push('period--alive')
            } else {
                classList.push('period--expired')
            }
            return _.join(classList, ' ')
        })
        const onBeforeRemove = (event: Event) => {
            event.stopPropagation()
            emit('remove', props)
        }
        return () => (
            <div class="todo-card flex flex-col">
                <div class="todo-card__header flex justify-between items-start">
                    <div class="flex justify-between items-center w-full">
                        <b class="text-truncate">{props.title}</b>
                        <button type="button" class="btn-close" onClick={onBeforeRemove}>
                            <i class="mdi mdi-close" />
                        </button>
                    </div>
                </div>
                <div class="todo-card__actions flex justify-end items-end">
                    {printPeriod.value && (
                        <div class={classListPeriod.value}>{printPeriod.value}</div>
                    )}
                </div>
            </div>
        )
    }
})
