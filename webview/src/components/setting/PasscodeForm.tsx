import { ref, defineComponent, type PropType, onMounted, watch } from 'vue'
import './PasscodeForm.scoped.scss'
export default defineComponent({
    name: 'PasscodeForm',
    emits: ['submit'],
    props: {
        title: {
            type: String as PropType<string>,
            default: '패스코드'
        },
        description: {
            type: String as PropType<string>,
            default: ''
        },
        limit: {
            type: Number as PropType<number>,
            default: 4
        }
    },
    setup(props, { emit }) {
        const idxRef = ref<number>(0)
        const inputRefs = ref<HTMLInputElement[]>([])
        const onFocusInput = () => {
            inputRefs.value[idxRef.value]?.focus()
        }
        const onBackspace = (event: KeyboardEvent) => {
            if (event.key !== 'Backspace') {
                return false
            }
            if (idxRef.value > 0) {
                idxRef.value--
            }
            inputRefs.value[idxRef.value].value = ''
        }
        const onInput = (event: Event, i: number) => {
            event.preventDefault()
            const target = event.target as HTMLInputElement
            if (!/^\d$/.test(target.value)) {
                target.value = ''
                return false
            }
            if (idxRef.value < inputRefs.value.length - 1) {
                idxRef.value++
                return
            }
            onSubmit()
        }
        const onReset = () => {
            idxRef.value = 0
            for (const input of inputRefs.value) {
                input.value = ''
            }
        }
        const onSubmit = (event?: Event) => {
            if (event) {
                event.preventDefault()
            }
            const passcode = inputRefs.value.map((input) => input.value).join('')
            if (passcode.length < inputRefs.value.length) {
                return false
            }
            if (!/^\d+$/.test(passcode)) {
                return false
            }
            emit('submit', passcode)
            onReset()
        }
        watch(idxRef, () => {
            onFocusInput()
        })
        onMounted(() => {
            onFocusInput()
        })
        return () => (
            <form
                class="passcode-form flex flex-col justify-center items-center gap-4 box-shadow"
                onClick={onFocusInput}
                onSubmit={onSubmit}
            >
                <div class="passcode-form__header flex flex-col justify-center items-center gap-4">
                    <b class="text-title">{props.title}</b>
                    <p class="text-desc">{props.description}</p>
                    <button
                        class={{
                            'btn-submit': true,
                            'btn-submit--active': idxRef.value === inputRefs.value.length - 1
                        }}
                        type="submit"
                    >
                        <i class="mdi mdi-lock"></i>
                    </button>
                </div>
                <div class="passcode-form__content flex justify-center items-center w-full gap-2">
                    {Array.from({ length: props.limit }).map((_, i) => (
                        <input
                            ref={(el) => {
                                inputRefs.value[i] = el as HTMLInputElement
                            }}
                            class={{
                                passcode: true,
                                'passcode--active': i === idxRef.value
                            }}
                            type="password"
                            maxlength="1"
                            readonly={i !== idxRef.value}
                            onInput={(event) => onInput(event, i)}
                            onKeydown={onBackspace}
                        />
                    ))}
                </div>
            </form>
        )
    }
})
