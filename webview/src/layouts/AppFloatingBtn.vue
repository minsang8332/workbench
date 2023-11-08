<template>
    <v-speed-dial
        v-model="value"
        @input="onInput"
        class="app-floating-btn"
        :bottom="bottom"
        :right="right"
        :direction="direction"
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
                    color: app.$app.scss('--theme-color-1'),
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
