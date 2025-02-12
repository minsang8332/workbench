import { defineComponent, reactive, computed, type PropType } from 'vue'
import type { Crawler } from '@/types/model'
import TextField from '@/components/form/TextField'
import './WorkerForm.scoped.scss'
interface IWorkerFormState {
    inputLabel: string
    inputLabelRules: ((value: string) => string | boolean)[]
}
export default defineComponent({
    name: 'WorkerForm',
    emits: ['submit', 'cancel'],
    components: {
        TextField
    },
    props: {
        id: {
            type: String as PropType<Crawler.IWorker['id']>,
            default: ''
        },
        label: {
            type: String as PropType<Crawler.IWorker['label']>,
            default: ''
        }
    },
    setup(props, { emit }) {
        const state = reactive<IWorkerFormState>({
            inputLabel: props.label,
            inputLabelRules: [
                (value: string): string | boolean => {
                    return value && /^[^\s].*$/.test(value)
                        ? true
                        : '최소 한 글자 이상은 입력해 주세요.'
                }
            ]
        })
        const validate = computed(() => {
            return state.inputLabelRules.every((rule: Function) => rule(state.inputLabel) === true)
        })
        const onSubmit = (event: Event) => {
            event.preventDefault()
            emit('submit', {
                id: props.id,
                label: state.inputLabel
            })
        }
        const onCancel = () => emit('cancel')
        return () => (
            <form class="worker-form flex flex-col justify-between" onSubmit={onSubmit}>
                <div class="worker-form__content flex flex-col gap-2">
                    <text-field
                        v-model={state.inputLabel}
                        rules={state.inputLabelRules}
                        label="라벨"
                        required
                        placeholder="라벨을 입력해 주세요"
                    />
                </div>
                <div class="worker-form__actions flex justify-center items-center gap-4">
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
