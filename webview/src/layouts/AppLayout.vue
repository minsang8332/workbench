<template>
    <v-app>
        <app-header />
        <v-main>
            <router-view />
        </v-main>
        <app-floating-btn />
        <app-modal v-model="$app.modal" />
        <app-drawer v-model="$app.drawer" />
        <app-menu v-model="$app.menu" v-bind="$app.bindMenu" />
    </v-app>
</template>
<script>
import AppHeader from '@/layouts/AppHeader.vue'
import AppDrawer from '@/layouts/AppDrawer.vue'
import AppFloatingBtn from '@/layouts/AppFloatingBtn.vue'
import AppMenu from '@/layouts/AppMenu.vue'
export default {
    name: 'AppLayout',
    components: {
        AppHeader,
        AppDrawer,
        AppFloatingBtn,
        AppMenu,
    },
}
</script>
<style scoped lang="scss">
.v-speed-dial {
    position: absolute;
}
.v-btn--floating {
    position: relative;
}
</style>
