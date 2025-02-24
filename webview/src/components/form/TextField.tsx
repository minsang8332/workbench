import _ from 'lodash'
import dayjs from 'dayjs'
import VueDatePicker from '@vuepic/vue-datepicker'
import { computed, defineComponent, type PropType } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import './TextField.scoped.scss'
export enum TEXT_FIELD {
    TEXT = 'text',
    NUMBER = 'number',
    TEXTAREA = 'textarea',
    DATEPICKER = 'datepicker'
}
export default defineComponent({
    name: 'TextField',
    emits: ['update:model-value', 'enter'],
    props: {
        modelValue: {
            type: [String, Number, Date, Array, null, undefined] as PropType<
                string | number | readonly string[] | null | undefined
            >
        },
        type: {
            type: String as PropType<TEXT_FIELD[keyof TEXT_FIELD]>,
            default: TEXT_FIELD.TEXT
        },
        name: {
            type: String as PropType<string>,
            default: TEXT_FIELD.TEXT
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
                return
            }
            const target = event.target as HTMLInputElement
            if (!_.isString(target.value)) {
                return
            }
            emit('update:model-value', target.value)
        }
        const onInputDatePicker = (date: Date) => {
            if (date == null) {
                emit('update:model-value', date)
            }
            const dayjsDate = dayjs(date)
            if (dayjsDate && dayjsDate.isValid()) {
                emit('update:model-value', date)
            }
        }
        const onFormat = (date: Date) => {
            return dayjs(date).format('YYYY.MM.DD')
        }
        return () => (
            <div class="text-field">
                {props.label && <label for={props.name}>{props.label}</label>}
                {props.required && <span class="text-red-500">*</span>}
                {props.type === TEXT_FIELD.DATEPICKER ? (
                    <VueDatePicker
                        model-value={props.modelValue}
                        placeholder={props.placeholder}
                        enable-time-picker={false}
                        format={onFormat}
                        locale="ko-KR"
                        auto-apply
                        teleport
                        onUpdate:model-value={onInputDatePicker}
                    />
                ) : props.type === TEXT_FIELD.TEXTAREA ? (
                    <textarea
                        class="text-field__textarea"
                        value={props.modelValue}
                        onInput={onInput}
                        placeholder={props.placeholder}
                    />
                ) : props.type === TEXT_FIELD.NUMBER ? (
                    <input
                        class="text-field__input"
                        type={props.type}
                        value={props.modelValue}
                        onInput={onInput}
                        placeholder={props.placeholder}
                        onKeydown={onEnter}
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
