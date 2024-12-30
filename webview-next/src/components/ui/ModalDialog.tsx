import { computed, defineComponent, Transition } from 'vue'
import type { PropType } from 'vue'
import _ from 'lodash'
import './ModalDialog.scoped.scss'
export default defineComponent({
    name: 'Modal',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        message: {
            type: [String, Array, null] as PropType<string | string[] | null>,
            default: ''
        },
        persistent: {
            type: Boolean,
            default: false
        },
        hideActions: {
            type: Boolean,
            default: false
        },
        ok: {
            type: Function as PropType<() => {}>
        }
    },
    setup(props, { emit, slots }) {
        const getMessage = computed(() => {
            let messages: string[] = []
            try {
                const message = props.message
                if (_.isArray(message)) {
                    messages = message
                } else if (_.isString(message)) {
                    messages.push(message)
                }
            } catch (e) {
                console.error(e)
            }
            return messages
        })
        const onClose = (event: Event) => {
            event.stopPropagation()
            emit('update:modelValue', false)
        }
        return () => (
            <div class="modal-dialog">
                {props.modelValue && (
                    <div
                        class="fixed inset-0 z-[10001] h-screen w-screen bg-black/30 flex justify-center items-center"
                        onClick={onClose}
                    >
                        <div
                            class="modal-dialog__card"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div class="modal-dialog__card-header flex justify-between items-center">
                                <b class="text-white">{props.title}</b>
                                <button type="button" class="btn-close" onClick={onClose}>
                                    <i class="mdi mdi-close" />
                                </button>
                            </div>
                            <div class="modal-dialog__card-content flex flex-col justify-center items-center">
                                {slots.default
                                    ? slots.default()
                                    : getMessage.value.map((message) => (
                                          <p class="text-truncate">{message}</p>
                                      ))}
                            </div>
                            {props.hideActions == false && (
                                <div class="modal-dialog__card-actions flex justify-evenly items-center">
                                    <button type="button" class="btn-cancel" onClick={onClose}>
                                        취소
                                    </button>
                                    <button type="button" class="btn-confirm" onClick={props.ok}>
                                        확인
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
})
