import _ from 'lodash'
import { computed, defineComponent, onBeforeMount, reactive, ref, watch, type PropType } from 'vue'
import SelectField from '@/components/form/SelectField'
import SwitchField from '@/components/form/SwitchField'
import type { Crawler } from '@/types/model'
import './ScheduleForm.scoped.scss'
interface IScheduleFormState {
    selectedMonths: string[]
    selectedDates: string[]
    selectedWeeks: string[]
    selectedHours: string[]
    selectedMinutes: string[]
}
export default defineComponent({
    name: 'ScheduleForm',
    emits: ['submit', 'cancel'],
    props: {
        id: {
            type: String as PropType<Crawler.ISchedule['id']>,
            default: ''
        },
        workerId: {
            type: String as PropType<Crawler.ISchedule['workerId']>,
            default: ''
        },
        active: {
            type: Boolean as PropType<Crawler.ISchedule['active']>,
            default: false
        },
        expression: {
            type: String as PropType<Crawler.ISchedule['expression']>,
            default: ''
        }
    },
    components: {
        SelectField,
        SwitchField
    },
    setup(props, { emit }) {
        const state = reactive<IScheduleFormState>({
            selectedMonths: [],
            selectedDates: [],
            selectedWeeks: [],
            selectedHours: [],
            selectedMinutes: []
        })
        const useActiveRef = ref<boolean>(props.active)
        const useWeeksRef = ref<boolean>(false)
        const validate = computed(() => {
            return (
                !_.isEmpty(state.selectedMonths) &&
                (!_.isEmpty(state.selectedWeeks) || !_.isEmpty(state.selectedDates)) &&
                !_.isEmpty(state.selectedHours) &&
                !_.isEmpty(state.selectedMinutes)
            )
        })
        const getMonths = computed(() => {
            const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
                label: m + '월',
                value: m.toString()
            }))
            months.unshift({ label: '매월', value: '*' })
            return months
        })
        const getWeeks = computed(() => {
            return [
                { label: '월요일', value: '1' },
                { label: '화요일', value: '2' },
                { label: '수요일', value: '3' },
                { label: '목요일', value: '4' },
                { label: '금요일', value: '5' },
                { label: '토요일', value: '6' },
                { label: '일요일', value: '0' }
            ]
        })
        const getDates = computed(() => {
            const dates = Array.from({ length: 31 }, (_, i) => i + 1).map((d) => ({
                label: d + '일',
                value: d.toString()
            }))
            dates.unshift({ label: '매일', value: '*' })
            return dates
        })
        const getHours = computed(() => {
            const hours = Array.from({ length: 23 }, (_, i) => i + 1).map((h) => ({
                label: h + '시',
                value: h.toString()
            }))
            hours.unshift({ label: '정각', value: '0' })
            hours.splice(0, 0, { label: '매 시간마다', value: '*' })
            return hours
        })
        const getMinutes = computed(() => {
            const minutes = Array.from({ length: 59 }, (_, i) => i + 1).map((m) => ({
                label: m + '분',
                value: m.toString()
            }))
            minutes.unshift({ label: '정각', value: '0' })
            minutes.splice(0, 0, { label: '매 분마다', value: '*' })
            return minutes
        })
        const onSubmit = (event: Event) => {
            event.preventDefault()
            const expression = onStringifyExpression()
            const active = useActiveRef.value
            emit('submit', {
                id: props.id,
                workerId: props.workerId,
                active,
                expression
            })
        }
        const onCancel = () => emit('cancel')
        const onParseExpression = (expression: string) => {
            const expressions = expression.split(' ')
            if (expressions.length !== 5) {
                return
            }
            for (let i = 0; i < expressions.length; i++) {
                switch (i) {
                    case 4:
                        state.selectedWeeks = [..._.split(expressions[i], ',')]
                        break
                    case 3:
                        state.selectedMonths = [..._.split(expressions[i], ',')]
                        break
                    case 2:
                        state.selectedDates = [..._.split(expressions[i], ',')]
                        break
                    case 1:
                        state.selectedHours = [..._.split(expressions[i], ',')]
                        break
                    case 0:
                        state.selectedMinutes = [..._.split(expressions[i], ',')]
                        break
                }
            }
        }
        const onStringifyExpression = () => {
            let expressions = Array.from({ length: 5 }, (_, i) => '*')
            for (let i = 0; i < expressions.length; i++) {
                switch (i) {
                    case 4:
                        expressions[i] =
                            state.selectedWeeks.length > 0 ? state.selectedWeeks.join(',') : '*'
                        break
                    case 3:
                        expressions[i] =
                            state.selectedMonths.length > 0 ? state.selectedMonths.join(',') : '*'
                        break
                    case 2:
                        expressions[i] =
                            state.selectedDates.length > 0 ? state.selectedDates.join(',') : '*'
                        break
                    case 1:
                        expressions[i] =
                            state.selectedHours.length > 0 ? state.selectedHours.join(',') : '*'
                        break
                    case 0:
                        expressions[i] =
                            state.selectedMinutes.length > 0 ? state.selectedMinutes.join(',') : '*'
                        break
                }
            }
            return expressions.join(' ')
        }
        const onFilterExpression = (payload: string[]) => {
            if (_.last(payload) == '*') {
                payload = ['*']
            } else {
                payload = payload.filter((v) => v !== '*')
            }
            return payload
        }
        watch(useWeeksRef, () => {
            state.selectedDates = []
            state.selectedWeeks = []
        })
        onBeforeMount(() => {
            onParseExpression(props.expression)
        })
        return () => (
            <form class="schedule-form" onSubmit={onSubmit}>
                <div class="schedule-form__content flex flex-col gap-4">
                    <div class="schedule-tabs flex justify-between items-center gap-2 self-stretch">
                        <button
                            type="button"
                            class={{ activate: useWeeksRef.value == false }}
                            onClick={(e) => (useWeeksRef.value = false)}
                        >
                            날짜별
                        </button>
                        <button
                            type="button"
                            class={{ activate: useWeeksRef.value }}
                            onClick={(e) => (useWeeksRef.value = true)}
                        >
                            요일별
                        </button>
                    </div>
                    <div class="schedule-field flex justify-between items-center">
                        <label>월</label>
                        <select-field
                            modelValue={state.selectedMonths}
                            onUpdate:modelValue={(payload: string[]) => {
                                state.selectedMonths = [...onFilterExpression(payload)]
                            }}
                            items={getMonths.value}
                            multiple
                        />
                    </div>
                    {useWeeksRef.value ? (
                        <div class="schedule-field flex justify-between items-center self-stretch">
                            <label>요일</label>
                            <select-field
                                v-model={state.selectedWeeks}
                                items={getWeeks.value}
                                multiple
                            />
                        </div>
                    ) : (
                        <div class="schedule-field flex justify-between items-center self-stretch">
                            <label>일자</label>
                            <select-field
                                modelValue={state.selectedDates}
                                onUpdate:modelValue={(payload: string[]) => {
                                    state.selectedDates = [...onFilterExpression(payload)]
                                }}
                                items={getDates.value}
                                multiple
                            />
                        </div>
                    )}
                    <div class="schedule-field flex justify-between items-center">
                        <label>시간</label>
                        <select-field
                            modelValue={state.selectedHours}
                            onUpdate:modelValue={(payload: string[]) => {
                                state.selectedHours = [...onFilterExpression(payload)]
                            }}
                            items={getHours.value}
                            multiple
                        />
                    </div>
                    <div class="schedule-field flex justify-between items-center">
                        <label>분</label>
                        <select-field
                            modelValue={state.selectedMinutes}
                            onUpdate:modelValue={(payload: string[]) => {
                                state.selectedMinutes = [...onFilterExpression(payload)]
                            }}
                            items={getMinutes.value}
                            multiple
                        />
                    </div>
                    <div class="schedule-field flex justify-between items-center !h-[3rem]">
                        <label>활성화 여부 </label>
                        <switch-field v-model={useActiveRef.value} />
                    </div>
                </div>
                <div class="schedule-form__actions flex justify-center items-center gap-4">
                    <button type="button" class="btn-cancel" onClick={onCancel}>
                        취소
                    </button>
                    <button type="submit" class="btn-submit" disabled={!validate.value}>
                        등록
                    </button>
                </div>
            </form>
        )
    }
})
