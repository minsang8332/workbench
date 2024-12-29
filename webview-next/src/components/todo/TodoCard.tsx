import _ from 'lodash'
import { unref, computed, defineComponent } from 'vue'
import dayjs from 'dayjs'
import './TodoCard.scoped.scss'
interface TodoCard {
    dDay?: number
}
enum TodoCardStatus {
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
            const value: TodoCard = {}
            if (startedAt.isValid() && endedAt.isValid()) {
                const dDay = endedAt.startOf('day').diff(dayjs(new Date()).startOf('day'), 'day')
                value.dDay = dDay
            }
            return value
        })
        const isExpired = computed(
            () => _.isNumber(getProps.value.dDay) && getProps.value.dDay < 0 && props.status !== 2
        )
        const onBeforeRemove = (event: Event) => {
            event.stopPropagation()
            emit('remove', props)
        }
        return () => (
            <div class="todo-card flex flex-col">
                <div class="todo-card__header flex justify-between items-start">
                    <div class="flex items-center gap-2 w-75">
                        <b class="text-truncate">{props.title}</b>
                    </div>
                    <div class="flex justify-end items-center w-25">
                        <button type="button" class="btn-close" onClick={onBeforeRemove}>
                            <i class="mdi mdi-close" />
                        </button>
                    </div>
                </div>
                <div class="todo-card__actions flex justify-end items-end">
                    {
                        <div
                            class={[
                                'period',
                                isExpired.value == true ? 'period--expired' : 'period--alive'
                            ].join(' ')}
                        >
                            {isExpired.value
                                ? TodoCardStatus.EXPIRED
                                : `${getProps.value.dDay}일 전`}
                        </div>
                    }
                </div>
            </div>
        )
    }
})
