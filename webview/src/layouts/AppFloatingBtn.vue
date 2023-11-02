<template>
    <v-speed-dial
        v-model="fab"
        class="app-floating-btn"
        :bottom="bottom"
        :right="right"
        :direction="direction"
        :transition="transition"
    >
        <template v-slot:activator>
            <v-btn v-model="fab" plain class="btn-afb-main" dark fab>
                <v-icon> fa-solid fa-gear </v-icon>
            </v-btn>
        </template>
        <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="green darker-2"
                    fab
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="onClickNewer"
                >
                    <v-icon>fa-solid fa-pencil</v-icon>
                </v-btn>
            </template>
            <p class="white--text">새로운 문서</p>
        </v-tooltip>
    </v-speed-dial>
</template>
<script>
export default {
    name: 'AppFloatingBtn',
    data: () => ({
        fab: false,
        direction: 'top',
        right: true,
        bottom: true,
        transition: 'slide-y-reverse-transition',
    }),
    methods: {
        onClickNewer() {
            this.$router.replace({ name: 'markdown' }).catch((e) => e)
        },
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/app.scss';
.app-floating-btn {
    text-align: right;
    .btn-afb-main {
        background: $theme !important;
    }
}
</style>
