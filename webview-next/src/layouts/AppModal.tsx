import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import _ from 'lodash'
import '@/layouts/AppModal.scoped.scss'
export default defineComponent({
    name: 'AppModal',
    props: {
        value: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        title: {
            type: String as PropType<string>,
            default: '안내'
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
        const hide = () => {
            emit('update:modelValue', false)
        }
        return () => (
            <v-dialog
                class="app-modal"
                scrollable
                height="calc(100vh/3)"
                modelValue={props.value}
                onUpdate:modelValue={onUpdateModelValue}
            >
                <v-card class="am-card fill-height" flat>
                    <v-row class="am-row-title bg-theme-g1" no-gutters>
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
                        {JSON.stringify(props.ok)}
                    </v-row>
                    <v-row class="am-row-actions" no-gutters>
                        <v-col>
                            <v-btn variant="text" block class="am-btn-no" onClick={hide}>
                                취소
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn variant="text" block class="am-btn-ok" onClick={props.ok}>
                                확인
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-dialog>
        )
    }
})
/*
<template>
    <v-dialog
        scrollable
        content-class="app-modal"
        :value="value"
        @input="onInput"
    >
        <v-card class="card-app-modal fill-height" flat>
            <v-row class="row-am-title bg-theme-g1" no-gutters>
                <v-col align="center">
                    <b class="text-am-title white--text">
                        {{ title }}
                    </b>
                </v-col>
            </v-row>
            <v-divider />
            <v-row class="row-am-message" no-gutters>
                <v-col class="px-4">
                    <p
                        v-for="(message, i) in getMessage"
                        class="text-am-message text-truncate"
                        :key="`app-modal-msg-${i}`"
                    >
                        {{ message }}
                    </p>
                </v-col>
            </v-row>
            <template v-if="ok">
                <v-row class="row-am-actions" no-gutters>
                    <v-col>
                        <v-btn
                            text
                            block
                            class="btn-am-no"
                            @click="onInput(false)"
                            >취소</v-btn
                        >
                    </v-col>
                    <v-col>
                        <v-btn text block class="btn-am-ok" @click="ok"
                            >확인</v-btn
                        >
                    </v-col>
                </v-row>
            </template>
        </v-card>
    </v-dialog>
</template>
<script>
import _ from 'lodash'
export default {
    name: 'AppModal',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        title: {
            type: [String, null],
            default: '안내',
        },
        message: {
            type: [String, Array, null],
            default: '',
        },
        ok: {
            type: [Function, null],
            default: null,
        },
    },
    computed: {
        getMessage() {
            let messages = []
            try {
                const message = this.message
                if (_.isArray(message)) {
                    messages = message
                } else if (_.isString(message)) {
                    messages.push(message)
                }
            } catch (e) {
                console.error(e)
            }
            return messages
        },
    },
    methods: {
        onInput(value) {
            this.$emit('input', value)
        },
    },
}
</script>
*/
