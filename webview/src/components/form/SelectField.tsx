import _ from 'lodash'
import { ref, computed, defineComponent, type PropType, nextTick, watch, onMounted } from 'vue'
import './SelectField.scoped.scss'
export interface ISelectFieldItem {
    label: string
    value: string | number | boolean
}
export default defineComponent({
    name: 'SelectField',
    emits: ['update:model-value'],
    props: {
        modelValue: {
            type: [String, Number, Boolean, Array] as PropType<
                ISelectFieldItem['value'] | ISelectFieldItem['value'][]
            >,
            default: null
        },
        items: {
            type: Array as PropType<ISelectFieldItem[]>,
            default: () => []
        },
        multiple: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props, { emit }) {
        const itemsRef = ref<HTMLUListElement>()
        const visibleRef = ref<boolean>(false)
        const printModelValue = computed(() => {
            let text = '선택안함'
            if (_.isEmpty(props.modelValue)) {
                return text
            }
            if (_.isArray(props.modelValue)) {
                text = props.items
                    .filter(
                        (item) =>
                            _.isArray(props.modelValue) && props.modelValue.includes(item.value)
                    )
                    .map((item) => item.label)
                    .join(',')
                /*
                const first = _.first(props.modelValue)
                if (first) {
                    const item = props.items.find((item) => item.value == first)
                    if (item) {
                        text = item.label
                        if (props.modelValue.length > 1) {
                            text = `${item.label} 외 ${props.modelValue.length - 1}건`
                        }
                    }
                }
                */
                return text
            }
            const item = props.items.find((item) => item.value == props.modelValue)
            if (item) {
                text = item.label
            }
            return text
        })
        const onShow = (event: Event, payload?: boolean) => {
            if (_.isBoolean(payload)) {
                visibleRef.value = payload
            } else {
                visibleRef.value = !visibleRef.value
            }
        }
        const onSelectItem = (item: ISelectFieldItem) => {
            if (_.isArray(props.modelValue)) {
                const idx = props.modelValue.findIndex((selectedItem) => selectedItem == item.value)
                const items = [...props.modelValue]
                if (idx === -1) {
                    items.push(item.value)
                } else {
                    items.splice(idx, 1)
                }
                emit('update:model-value', items)
            } else {
                emit('update:model-value', item.value)
            }
            visibleRef.value = false
        }
        const isActivated = (item: ISelectFieldItem) => {
            let activated = false
            if (
                props.multiple &&
                _.isArray(props.modelValue) &&
                props.modelValue.find((v) => v === item.value)
            ) {
                activated = true
            } else if (props.modelValue === item.value) {
                activated = true
            }
            return activated
        }
        watch(visibleRef, (newValue) => {
            if (newValue) {
                itemsRef.value?.focus()
            }
        })
        return () => (
            <div class="select-field flex relative h-full">
                <button
                    type="button"
                    class="select-field__button w-full"
                    onClick={(e) => onShow(e)}
                    onFocusout={(e) => {
                        visibleRef.value = false
                    }}
                >
                    {printModelValue.value}
                </button>
                <ul class={{ hidden: !visibleRef.value }}>
                    {props.items.map((item) => (
                        <li
                            class="flex justify-between items-center"
                            onMousedown={(e) => {
                                onSelectItem(item)
                                e.stopPropagation()
                            }}
                        >
                            <button type="button">
                                {isActivated(item) && <i class="mdi mdi-check"></i>}
                            </button>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
})
