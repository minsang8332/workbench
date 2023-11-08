<template>
    <v-speed-dial
        v-model="value"
        @input="onInput"
        class="app-floating-btn"
        :bottom="bottom"
        :right="right"
        :direction="direction"
        transition="slide-y-reverse-transition"
    >
        <template v-slot:activator>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-model="value"
                        :color="$app.scss('--theme-color-1')"
                        dark
                        fab
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon>fa-solid fa-gear</v-icon>
                    </v-btn>
                </template>
                <p class="white--text">환경설정</p>
            </v-tooltip>
        </template>
        <v-tooltip
            v-for="(item, i) in items"
            :key="`app-floating-btn-${i}`"
            left
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    fab
                    dark
                    :color="item.color"
                    v-bind="attrs"
                    v-on="on"
                    @click="onClickBtn(item)"
                >
                    <v-icon>{{ item.icon }}</v-icon>
                </v-btn>
            </template>
            <p class="white--text">{{ item.desc }}</p>
        </v-tooltip>
    </v-speed-dial>
</template>
<script>
export default {
    name: 'AppFloatingBtn',
    props: {
        direction: {
            type: [String, null],
            default: 'top',
        },
        right: {
            type: [Boolean],
            default: true,
        },
        bottom: {
            type: [Boolean],
            default: true,
        },
    },
    data() {
        const app = this
        return {
            value: false,
            items: [
                {
                    desc: '통계 및 추이',
                    icon: 'mdi-chart-bar',
                    color: 'green darken-1',
                    callback() {
                        app.$router
                            .replace({ name: 'dashboard' })
                            .catch((e) => e)
                    },
                },
            ],
        }
    },
    methods: {
        onClickBtn({ callback = Function } = {}) {
            if (callback) {
                callback()
            }
        },
        onInput(value) {
            this.$emit('input', value)
        },
    },
}
</script>
<style lang="scss" scoped>
.app-floating-btn {
    text-align: right;
}
</style>
