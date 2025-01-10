import _ from 'lodash'
import dayjs from 'dayjs'
import VueDatePicker from '@vuepic/vue-datepicker'
import { computed, defineComponent, type PropType } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import './TextField.scoped.scss'
export enum TextField {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    DATEPICKER = 'datepicker'
}
type TextFieldType = TextField[keyof TextField]
export default defineComponent({
    name: 'TextField',
    emits: ['update:model-value', 'enter'],
    props: {
        modelValue: {
            type: String as PropType<string>,
            default: undefined
        },
        type: {
            type: String as PropType<TextFieldType>,
            default: TextField.INPUT
        },
        name: {
            type: String as PropType<string>,
            default: TextField.INPUT
        },
        label: {
            type: String as PropType<string>,
            default: ''
        },
        required: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        placeholder: {
            type: String as PropType<string>,
            default: ''
        },
        rules: {
            type: Array as PropType<Function[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const printErrors = computed(() => {
            let errors = []
            if (!_.isNil(props.modelValue)) {
                errors = props.rules
                    .map((rule) => rule(props.modelValue))
                    .filter((rule) => rule !== true)
            }
            return errors
        })
        const onEnter = (event: KeyboardEvent) => {
            if (event.key == 'Enter') {
                emit('enter')
            }
        }
        const onInput = (event?: Event) => {
            if (!(event && event.target)) {
                return false
            }
            const target = event.target as HTMLInputElement
            if (!_.isString(target.value)) {
                return false
            }
            emit('update:model-value', target.value)
        }
        const onInputDatePicker = (date: Date) => {
            const dayjsDate = dayjs(date)
            if (!(dayjsDate && dayjsDate.isValid())) {
                return false
            }
            emit('update:model-value', date)
        }
        const onFormat = (date: Date) => {
            return dayjs(date).format('YYYY.MM.DD')
        }
        return () => (
            <div class="text-field">
                {props.label && <label for={props.name}>{props.label}</label>}
                {props.required && <span class="text-red-500">*</span>}
                {props.type === TextField.DATEPICKER ? (
                    <VueDatePicker
                        model-value={props.modelValue}
                        placeholder={props.placeholder}
                        enable-time-picker={false}
                        locale="ko-KR"
                        format={onFormat}
                        auto-apply
                        teleport
                        onUpdate:model-value={onInputDatePicker}
                    />
                ) : props.type === TextField.TEXTAREA ? (
                    <textarea
                        class="text-field__textarea"
                        value={props.modelValue}
                        onInput={onInput}
                        placeholder={props.placeholder}
                    />
                ) : (
                    <input
                        class="text-field__input"
                        value={props.modelValue}
                        onInput={onInput}
                        placeholder={props.placeholder}
                        onKeydown={onEnter}
                    />
                )}
                {printErrors.value.map((error) => (
                    <p class="text-sm text-red-500 py-2">{error}</p>
                ))}
            </div>
        )
    }
})
