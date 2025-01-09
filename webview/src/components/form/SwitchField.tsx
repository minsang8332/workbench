import _ from 'lodash'
import { ref, defineComponent, type PropType } from 'vue'
import './SwitchField.scoped.scss'
export default defineComponent({
    name: 'SwitchField',
    emits: ['update:model-value'],
    props: {
        modelValue: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        disabled: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props, { emit }) {
        const onChange = (event: Event) => {
            event.preventDefault()
            const target = event.target as HTMLInputElement
            // 브라우저 체크박스 상태를 막음
            target.checked = props.modelValue
            // 기존의 반대 값을 전달한다
            emit('update:model-value', !props.modelValue)
        }
        return () => (
            <div class="switch-field">
                <input
                    type="checkbox"
                    class="switch-field__input"
                    checked={props.modelValue}
                    onChange={onChange}
                    disabled={props.disabled}
                />
            </div>
        )
    }
})
