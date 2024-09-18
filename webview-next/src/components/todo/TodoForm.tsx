import _ from 'lodash'
import dayjs from 'dayjs'
import type { VForm } from 'vuetify/components'
import { defineComponent, reactive, computed, unref, ref, inject } from "vue"
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import './TodoForm.scoped.scss'
import { useAppStore } from '@/stores/app'
import { useTodoStore } from '@/stores/todo'
export default defineComponent({
    name: 'TodoForm',
    emits: ['cancel', 'submit'],
    props: {
        id: {
            type: [String],
            default: ''
        },
        title: {
            type: [String, null],
            default: null
        },
        description: {
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
        const $toast = inject('toast') as IToastPlugin
        const appStore = useAppStore()
        const todoStore = useTodoStore()
        const formRef = ref<VForm | null>(null)
        const state = reactive<any>({
            inputTitle: props.title,
            inputDescription: props.description,
            inputStartedAt: props.startedAt,
            inputStatus: props.status,
            inputEndedAt: props.endedAt,
            rules: [
                (value: any) => {
                    return /^(?!\s).+$/.test(value) ? true : '최소 한 글자 이상은 입력해 주세요.'
                },
            ],
        })
        const validPeriod = computed(() => {
            const startedAt = dayjs(state.inputStartedAt)
            const endedAt = dayjs(state.inputEndedAt)
            if (!(startedAt.isValid() && endedAt.isValid())) {   
                return false
            }
            if (startedAt.isBefore(endedAt)) {
                return true
            }
            return false
        })
        const onDatePickerFormat = (date: Date) => {
            return dayjs(date).format('YYYY.MM.DD')
        }
        const onSubmit = async () => {
            let submit = false
            try {
                const form = unref(formRef)
                if (!form) return submit
                const validation = await form.validate()
                if (!(validation && validation.valid)) {
                    throw new Error('양식이 유효하지 않아 카드를 생성 할 수 없습니다.')
                }
                if (state.inputStartedAt && state.inputEndedAt && unref(validPeriod) == false) {
                    throw new Error('시작일과 마감일의 기한을 확인해 주세요.')
                }
                if (await todoStore.saveTodo({
                    id: props.id,
                    title: state.inputTitle,
                    description: state.inputDescription,
                    status: state.inputStatus,
                    tasks: [],
                    startedAt: state.inputStartedAt,
                    endedAt: state.inputEndedAt
                })) {
                    emit('submit')
                    $toast.success('정상적으로 등록 및 편집되었습니다.')
                }
            } catch (e) {
                $toast.error(e as Error)
            }
            return submit
        }
        const onCancel = () => {
            emit('cancel')
        }
        return () =>
            <v-form 
                ref={formRef}
                class="todo-form d-flex flex-column pt-4 pb-4 ga-3"
                submit={onSubmit}
            >
                <v-text-field
                    v-model={state.inputTitle}
                    rules={state.rules}
                    label="제목을 입력해 주세요"
                    variant="outlined"
                    color="#3c3c3c"
                />
                <v-textarea
                    v-model={state.inputDescription}
                    label="내용을 입력해 주세요"
                    variant="outlined"
                    color="#3c3c3c"
                    auto-grow
                />
                <VueDatePicker
                    v-model={state.inputStartedAt}
                    placeholder="시작일을 선택해 주세요."
                    auto-apply
                    enable-time-picker={false}
                    teleport
                    locale="ko-KR"
                    format={onDatePickerFormat}
                />
                <VueDatePicker
                    v-model={state.inputEndedAt}
                    placeholder="마감일을 선택해 주세요."
                    auto-apply
                    enable-time-picker={false}
                    teleport
                    locale="ko-KR"
                    format={onDatePickerFormat}
                />
                {
                    <v-messages
                        active={state.inputStartedAt && state.inputEndedAt && unref(validPeriod) == false}
                        messages={['시작일과 마감일이 유효하지 않습니다']}
                        color="#B00020"
                    />
                }
                <v-row class="todo-form__actions d-flex ga-4" no-gutters>
                    <v-col>
                        <v-btn block variant="tonal" class="btn-no" onClick={onCancel}>취소</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn type="submit" class="btn-submit text-white" block variant="flat" color={appStore.scss('--theme-color-1')}>
                            <span class="text-white">등록</span>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
    }
})