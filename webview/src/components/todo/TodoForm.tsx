import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { defineComponent, reactive, computed, toRaw, type PropType } from 'vue'
import TextField from '@/components/form/TextField'
import TodoSprintCard from '@/components/todo/TodoSprintCard'
import type { ITodoSprint } from '@/types/model'
import '@/components/todo//TodoForm.scoped.scss'
dayjs.extend(isSameOrBefore)
interface ITodoFormState {
    inputTitle: string
    inputDescription: string
    inputStatus: number
    inputStartedAt: Date | string | null
    inputEndedAt: Date | string | null
    inputTitleRules: ((value: string) => string | boolean)[]
    inputEndedAtRules: ((value: Date) => string | boolean)[]
    sprints: ITodoSprint[]
}
export default defineComponent({
    name: 'TodoForm',
    emits: ['cancel', 'submit'],
    components: {
        TextField,
        TodoSprintCard
    },
    props: {
        id: {
            type: String as PropType<string>,
            default: ''
        },
        title: {
            type: String as PropType<string>,
            default: ''
        },
        description: {
            type: String as PropType<string>,
            default: ''
        },
        status: {
            type: Number as PropType<number>,
            default: 0
        },
        startedAt: {
            type: [Date, String] as PropType<Date | string | null>,
            default: null
        },
        endedAt: {
            type: [Date, String] as PropType<Date | string | null>,
            default: null
        },
        sprints: {
            type: Array as PropType<ITodoSprint[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const state = reactive<ITodoFormState>({
            inputTitle: props.title,
            inputDescription: props.description,
            inputStatus: props.status,
            inputStartedAt: props.startedAt,
            inputEndedAt: props.endedAt,
            inputTitleRules: [
                (value: string): string | boolean => {
                    return value && /^[^\s].*$/.test(value.trim())
                        ? true
                        : '최소 한 글자 이상은 입력해 주세요.'
                }
            ],
            inputEndedAtRules: [
                (value: Date): string | boolean => {
                    // 날짜를 아무것도 입력하지 않았다면
                    if (!(state.inputStartedAt && value)) {
                        return true
                    }
                    // 마감일자가 유효하며 시작일자와 비교 했을 때 기간차이가 양수 값으로 유효하다면
                    const endedAt = dayjs(value)
                    if (endedAt.isValid() && dayjs(state.inputStartedAt).isSameOrBefore(endedAt)) {
                        return true
                    }
                    return '마감일자는 시작일자 이후여야 합니다.'
                }
            ],
            sprints: props.sprints
        })
        const validate = computed(() => {
            return (
                state.inputEndedAtRules.every(
                    (rule: Function) => rule(state.inputEndedAt) === true
                ) &&
                state.inputTitleRules.every((rule: Function) => rule(state.inputTitle) === true)
            )
        })
        const printSprintCheckCount = computed(() =>
            _.toString(state.sprints.filter((sprint: ITodoSprint) => sprint.checked == true).length)
        )
        const onSubmit = (event: Event) => {
            event.preventDefault()
            emit('submit', {
                id: props.id,
                title: _.trim(state.inputTitle),
                description: state.inputDescription,
                status: state.inputStatus,
                startedAt: state.inputStartedAt,
                endedAt: state.inputEndedAt,
                sprints: toRaw(state.sprints)
            })
        }
        const onCancel = () => emit('cancel')
        const onCreateSprint = () => {
            state.sprints.push({
                title: '',
                todoId: props.id,
                description: null,
                checked: false,
                startedAt: null,
                endedAt: null
            })
        }
        const onUpdateSprint = (
            idx: number,
            { id, title, checked }: Pick<ITodoSprint, 'id' | 'title' | 'checked'>
        ) => {
            if (state.sprints[idx]) {
                const sprint = state.sprints[idx]
                sprint.id = id
                sprint.title = title
                sprint.checked = checked
                state.sprints.splice(idx, 1, sprint)
            }
        }
        const onDeleteSprint = (idx: number) => {
            state.sprints.splice(idx, 1)
        }
        return () => (
            <form class="todo-form flex flex-col justify-between" onSubmit={onSubmit}>
                <div class="todo-form__content flex flex-col justify-between gap-4">
                    <div class="flex justify-between gap-4">
                        <div class="flex flex-col flex-1 gap-2">
                            <text-field
                                v-model={state.inputTitle}
                                rules={state.inputTitleRules}
                                label="제목"
                                required
                                placeholder="제목을 입력해 주세요"
                            />
                            <text-field
                                v-model={state.inputDescription}
                                type="textarea"
                                label="작업 내용"
                                placeholder="작업 내용을 입력해 주세요"
                            />
                            <text-field
                                v-model={state.inputStartedAt}
                                type="datepicker"
                                label="시작일자"
                                placeholder="시작일을 선택해 주세요"
                            />
                            <text-field
                                v-model={state.inputEndedAt}
                                rules={state.inputEndedAtRules}
                                type="datepicker"
                                label="마감일자"
                                placeholder="마감일을 선택해 주세요"
                            />
                        </div>
                        <div class=" flex flex-col flex-1 gap-2">
                            <div class="flex justify-between items-center">
                                <label class="text-label">
                                    스프린트 ({printSprintCheckCount.value}/{state.sprints.length})
                                </label>
                            </div>
                            <button
                                type="button"
                                class="btn-create-sprint flex justify-center items-center h-12 gap-1"
                                onClick={onCreateSprint}
                            >
                                <i class="mdi mdi-plus" />
                            </button>
                            <ul class="flex flex-col gap-2">
                                {state.sprints.map((sprint: ITodoSprint, i) => (
                                    <todo-sprint-card
                                        {...sprint}
                                        key={i}
                                        onUpdate={(
                                            payload: Pick<ITodoSprint, 'id' | 'title' | 'checked'>
                                        ) => onUpdateSprint(i, payload)}
                                        onDelete={() => onDeleteSprint(i)}
                                        class="!h-12"
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="todo-form__actions flex justify-center items-center gap-4">
                    <button type="button" class="btn-cancel" onClick={onCancel}>
                        취소
                    </button>
                    <button type="submit" class="btn-submit" disabled={!validate.value}>
                        확인
                    </button>
                </div>
            </form>
        )
    }
})
