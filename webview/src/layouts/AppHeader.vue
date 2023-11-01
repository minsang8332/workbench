<template>
    <v-app-bar
        class="app-header"
        app
        dense
        hide-overlay
        clipped-left
        elevate-on-scroll
    >
        <v-btn
            text
            fab
            dark
            plain
            class="no-gutters"
            @click="$app.drawer = !$app.drawer"
        >
            <v-icon>fa-solid fa-bars</v-icon>
        </v-btn>
    </v-app-bar>
</template>
<script>
export default {
    name: 'AppHeader',
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/app.scss';
.app-header {
    background: $theme !important;
}
</style>
