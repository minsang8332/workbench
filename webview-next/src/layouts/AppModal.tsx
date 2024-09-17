import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import _ from 'lodash'
import '@/layouts/AppModal.scoped.scss'
export default defineComponent({
    name: 'AppModal',
    props: {
        modelValue: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        title: {
            type: String as PropType<string>,
            default: ''
        },
        message: {
            type: [String, Array, null] as PropType<string | string[] | null>,
            default: ''
        },
        ok: {
            type: [Function, null] as PropType<() => {} | null>,
            default: null
        }
    },
    setup(props, { emit }) {
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
                class="app-modal"
                scrollable
                height="calc(100vh/3)"
                modelValue={props.modelValue}
                onUpdate:modelValue={onUpdateModelValue}
            >
                <v-card class="am-card fill-height" flat>
                    <v-row class="am-row-title bg-theme-1" no-gutters>
                        <v-col align="center">
                            <b class="am-text-title text-white">{props.title}</b>
                        </v-col>
                    </v-row>
                    <v-divider />
                    <v-row class="am-row-message" no-gutters>
                        <v-col class="px-4">
                            {getMessage.value.map((message) => (
                                <p class="am-text-message text-truncate">{message}</p>
                            ))}
                        </v-col>
                    </v-row>
                    <v-row class="am-row-actions" no-gutters>
                        <v-col>
                            <v-btn variant="text" block class="am-btn-no" onClick={onClose}>
                                <span>취소</span>
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn variant="text" block class="am-btn-ok" onClick={props.ok}>
                                <span>확인</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
        )
    }
})
