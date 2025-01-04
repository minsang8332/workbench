import _ from 'lodash'
import { defineComponent, type PropType } from 'vue'
import './SwitchField.scoped.scss'
export default defineComponent({
    name: 'SwitchField',
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
        const onToggle = (event?: Event) => {
            emit('update:model-value', !props.modelValue)
        }
        return () => (
            <div class="switch-field">
                <input
                    type="checkbox"
                    class="switch-field__input"
                    checked={props.modelValue}
                    onClick={onToggle}
                    disabled={props.disabled}
                />
            </div>
        )
    }
})
