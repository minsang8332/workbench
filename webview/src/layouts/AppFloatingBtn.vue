<template>
    <v-speed-dial
        v-model="value"
        @input="onInput"
        class="app-floating-btn"
        :bottom="bottom"
        :right="right"
        :direction="direction"
        :style="styleAppFloatingBtn"
        transition="scale-transition"
    >
        <template v-slot:activator>
            <v-btn
                v-model="value"
                class="btn-app-floating"
                :style="{
                    backgroundImage: `url(${require('@/assets/img/favicon.png')})`,
                    backgroundSize: 'contain',
                }"
                dark
                fab
            >
                <v-icon>fa-solid fa-gear</v-icon>
            </v-btn>
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
                    desc: '대시보드',
                    icon: 'mdi-monitor-dashboard',
                    color: app.$app.scss('--theme-color-g1'),
                    callback() {
                        app.$router
                            .replace({ name: 'dashboard' })
                            .catch((e) => e)
                    },
                },
            ],
        }
    },
    computed: {
        styleAppFloatingBtn() {
            let style = {}
            if (this.bottom) {
                // 에디터의 경우 하단 버튼이 있어 간격을 더 준다.
                if (['markdown-editor'].includes(this.$route.name)) {
                    style.bottom = '64px'
                }
            }
            return style
        },
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
<style scoped lang="scss">
.v-speed-dial {
    position: fixed;
    transition: 0.5s;
}
.v-btn--floating {
    position: relative;
}
</style>
