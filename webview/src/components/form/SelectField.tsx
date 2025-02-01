import _ from 'lodash'
import { ref, computed, defineComponent, type PropType } from 'vue'
export interface ISelectFieldItem {
    label: string
    value: string | boolean
}
export default defineComponent({
    name: 'SelectField',
    emits: ['update:model-value'],
    props: {
        modelValue: {
            type: Object as PropType<ISelectFieldItem | ISelectFieldItem[]>,
            default: null
        },
        items: {
            type: Array as PropType<ISelectFieldItem[]>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const isShow = ref<boolean>(false)
        const printModelValue = computed(() => {
            let text = '선택안함'
            if (_.isEmpty(props.modelValue)) {
                return text
            }
            if (_.isArray(props.modelValue)) {
                const item = _.first(props.modelValue)
                if (item) {
                    return `${item.label} 외 ${props.modelValue.length - 1}건`
                }
            }
            return props.modelValue
        })
        const onShow = (event: Event, payload?: boolean) => {
            event.preventDefault()
            if (_.isBoolean(payload)) {
                isShow.value = payload
            } else {
                isShow.value = !isShow.value
            }
        }
        const onSelectItem = (item: ISelectFieldItem) => {
            if (_.isArray(props.modelValue)) {
                const idx = props.modelValue.findIndex(
                    (selectedItem) => selectedItem.value == item.value
                )
                const items = [...props.modelValue]
                if (idx === -1) {
                    items.push(item)
                } else {
                    items.splice(idx, 1)
                }
                emit('update:model-value', items)
            } else {
                emit('update:model-value', item)
            }
            isShow.value = false
        }
        return () => (
            <div class="select-field relative">
                <button class="btn-select-field w-full" onClick={(e) => onShow(e)}>
                    {printModelValue.value}
                </button>
                {isShow.value == true && (
                    <ul class="absolute w-full h-[25vh] top-full">
                        {props.items.map((item) => (
                            <li class="flex justify-between items-center">
                                <button
                                    class={{
                                        'btn-select-item': true,
                                        'btn-select-item--activate': _.isArray(props.modelValue)
                                            ? props.modelValue.find(
                                                  (selectedItem) => selectedItem.value == item.value
                                              )
                                            : props.modelValue.value == item.value
                                    }}
                                    onClick={(e) => onSelectItem(item)}
                                >
                                    <i class="mdi mdi-check"></i>
                                </button>
                                <b>{item.value}</b>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }
})
