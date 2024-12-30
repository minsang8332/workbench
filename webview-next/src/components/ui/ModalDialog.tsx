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
            type: [Function, null] as PropType<() => {} | null>,
            default: null
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
        const onUpdateModelValue = (event: Event) => {
            emit('update:modelValue', event)
        }
        const onClose = () => {
            emit('update:modelValue', false)
        }
        return () => (
            <v-dialog
                class="modal-dialog"
                scrollable
                modelValue={props.modelValue}
                onUpdate:modelValue={onUpdateModelValue}
                persistent={props.persistent}
            >
                <Transition name="fade">
                    {props.modelValue && (
                        <v-card class="modal-dialog__card">
                            <v-row class="modal-dialog__card-title bg-theme-1" no-gutters>
                                <v-col align="center">
                                    <b class="text-white">{props.title}</b>
                                </v-col>
                            </v-row>
                            <v-divider />
                            <v-row class="modal-dialog__card-content" no-gutters>
                                <v-col class="px-4">
                                    {slots.default
                                        ? slots.default()
                                        : getMessage.value.map((message) => (
                                              <p class="text-truncate">{message}</p>
                                          ))}
                                </v-col>
                            </v-row>
                            {props.hideActions == false && (
                                <v-row class="modal-dialog__card-actions" no-gutters>
                                    <v-col>
                                        <v-btn
                                            variant="text"
                                            block
                                            class="btn-no"
                                            onClick={onClose}
                                        >
                                            취소
                                        </v-btn>
                                    </v-col>
                                    <v-col>
                                        <v-btn
                                            variant="text"
                                            block
                                            class="btn-ok"
                                            onClick={props.ok}
                                        >
                                            확인
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            )}
                        </v-card>
                    )}
                </Transition>
            </v-dialog>
        )
    }
})
