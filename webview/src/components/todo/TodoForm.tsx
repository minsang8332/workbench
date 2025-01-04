import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { defineComponent, reactive, computed, unref, ref, inject } from 'vue'
import TextField from '@/components/form/TextField'
import '@/components/todo//TodoForm.scoped.scss'
dayjs.extend(isSameOrBefore)
export default defineComponent({
    name: 'TodoForm',
    emits: ['cancel', 'submit'],
    components: {
        TextField
    },
    props: {
        id: {
            type: [String]
        },
        title: {
            type: [String, null]
        },
        description: {
            type: [String, null]
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
        const $toast = inject('toast') as IToastPlugin
        const state = reactive<any>({
            tabSize: 4,
            inputTitle: props.title,
            inputDescription: props.description,
            inputStartedAt: props.startedAt,
            inputStatus: props.status,
            inputEndedAt: props.endedAt,
            inputTitleRules: [
                (value: string) => {
                    return value && /^[^\s].*$/.test(value)
                        ? true
                        : '최소 한 글자 이상은 입력해 주세요.'
                }
            ],
            inputEndedAtRules: [
                (value: Date) => {
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
            ]
        })
        const validate = computed(() => {
            return (
                state.inputEndedAtRules.every(
                    (rule: Function) => rule(state.inputEndedAt) === true
                ) &&
                state.inputTitleRules.every((rule: Function) => rule(state.inputTitle) === true)
            )
        })
        const onSubmit = async () => {
            let submit = false
            try {
                emit('submit', {
                    id: props.id,
                    title: state.inputTitle,
                    description: state.inputDescription,
                    status: state.inputStatus,
                    tasks: [],
                    startedAt: state.inputStartedAt,
                    endedAt: state.inputEndedAt
                })
            } catch (e) {
                $toast.error(e as Error)
            }
            return submit
        }
        const onCancel = () => emit('cancel')
        return () => (
            <form class="todo-form flex flex-col justify-between" onSubmit={onSubmit}>
                <div class="todo-form__content flex flex-col justify-start items-center gap-2">
                    <text-field
                        v-model={state.inputTitle}
                        rules={state.inputTitleRules}
                        label="제목"
                        placeholder="제목을 입력해 주세요"
                    />
                    <text-field
                        v-model={state.inputDescription}
                        type="textarea"
                        label="내용"
                        placeholder="내용을 입력해 주세요"
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
                <div class="todo-form__actions flex justify-center items-center gap-4">
                    <button type="button" class="btn-cancel" onClick={onCancel}>
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={!validate.value}
                        class="btn-submit"
                        onClick={() => {}}
                    >
                        확인
                    </button>
                </div>
            </form>
        )
    }
})
