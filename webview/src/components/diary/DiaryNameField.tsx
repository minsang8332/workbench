import _ from 'lodash'
import { defineComponent, computed, ref, unref, nextTick, onMounted, type PropType } from 'vue'
export default defineComponent({
    name: 'DiaryNameield',
    emits: ['change'],
    props: {
        value: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props, { emit }) {
        const inputRef = ref<HTMLInputElement>()
        const getValue = computed(() => {
            return _.last(props.value.split('/'))
        })
        const onInput = (event: Event) => {
            if (!(event && event.target)) {
                return
            }
            const target = event.target as HTMLInputElement
            if (!_.isString(target.value)) {
                return
            }
            if (!_.isNil(inputRef.value)) {
                inputRef.value.value = (event.target as HTMLInputElement).value
            }
        }
        const onFocus = () => {
            nextTick(() => {
                unref(inputRef)!.focus()
            })
        }
        const onFocusout = () => {
            if (!_.isNil(inputRef.value)) {
                emit('change', inputRef.value.value)
            }
        }
        const onChange = async (event: Event) => {
            if (!((event as KeyboardEvent).key && (event as KeyboardEvent).key == 'Enter')) {
                return
            }
            if (!_.isNil(inputRef.value)) {
                emit('change', inputRef.value.value)
            }
        }
        onMounted(() => {
            onFocus()
        })
        return () => (
            <input
                class="diary-name-field"
                ref={inputRef}
                value={getValue.value}
                onInput={onInput}
                onFocusout={onFocusout}
                onKeydown={onChange}
                onDblclick={(e) => e.stopPropagation()}
            />
        )
    }
})
