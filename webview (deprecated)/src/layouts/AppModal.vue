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
<style scoped lang="scss">
::v-deep .app-modal {
    width: calc(100vw / 3);
    .card-app-modal {
        width: 100%;
        height: calc(100vh / 3);
        .row-am-title {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 25%;
            max-height: 25%;
            b {
                font-size: 24px;
            }
        }
        .row-am-message {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 55%;
            overflow-y: auto;
            p {
                font-size: 20px;
                text-align: center;
            }
        }
        .row-am-actions {
            height: 20%;
            .v-btn {
                height: 100% !important;
                font-size: 20px;
            }
            .btn-am-no {
                color: var(--failed-color);
            }
            .btn-am-ok {
                color: var(--theme-color-1);
            }
        }
    }
}
</style>
