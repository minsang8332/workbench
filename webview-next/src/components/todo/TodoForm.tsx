import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
import type { VForm } from 'vuetify/components'
import { defineComponent, reactive, computed, unref, ref, inject, nextTick } from "vue"
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import './TodoForm.scoped.scss'
import { useAppStore } from '@/stores/app'
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
            default: ''
        },
        description: {
            type: [String, null],
            default: ''
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
        const formRef = ref<VForm | null>(null)
        const state = reactive<any>({
            tabSize: 4,
            inputTitle: props.title,
            inputDescription: props.description,
            inputStartedAt: props.startedAt,
            inputStatus: props.status,
            inputEndedAt: props.endedAt,
            rules: [
                (value: any) => {
                    return value && /^[^\s].*$/.test(value) ? true : '최소 한 글자 이상은 입력해 주세요.'
                },
            ],
        })
        const validPeriod = computed(() => {
            if (state.inputStartedAt == null && state.inputEndedAt == null) {
                return true
            }
            let startedAt = dayjs(state.inputStartedAt)
            if (!startedAt.isValid()) {   
                startedAt = dayjs()
            }
            const endedAt = dayjs(state.inputEndedAt)
            if (!endedAt.isValid()) {   
                return false
            }
            if (startedAt.isSameOrBefore(endedAt)) {
                return true
            }
            return false
        })
        const onKeyDown = (event: KeyboardEvent) => {
            // ctrl + a 는 전체 포커스
            if (event.key === 'a' && event.ctrlKey
            ||  event.key === 'a' && event.metaKey
            ) {
                event.preventDefault()
                const el = event.target as HTMLTextAreaElement
                el.select()
                el.focus()
            }
            //
            // 탭 누르면 띄워쓰기
            if (event.key == 'Tab') {
                event.preventDefault()
                let indent = ''
                for (let i=0; i<state.tabSize; i++) {
                    indent += ' '
                }
                nextTick(() => {
                    state.inputDescription += indent
                })
            }
        }
        const onDatePickerFormat = (date: Date) => {
            return dayjs(date).format('YYYY.MM.DD')
        }
        const onSubmit = async () => {
            let submit = false
            try {
                const form = unref(formRef)
                if (!form) {
                    return submit
                }
                if (unref(validPeriod) == false) {
                    return submit
                }
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
                    required
                />
                <v-textarea
                    v-model={state.inputDescription}
                    label="내용을 입력해 주세요"
                    variant="outlined"
                    color="#3c3c3c"
                    auto-grow
                    onKeydown={onKeyDown}
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
                        active={unref(validPeriod) == false}
                        messages={['기간이 옳바르지 않습니다']}
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