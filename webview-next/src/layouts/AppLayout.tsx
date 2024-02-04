import { RouterView } from 'vue-router'
export default () => (
    <v-app>
        <RouterView />
    </v-app>
)

/*
<template>
    <v-app>
        <app-header />
        <v-main>
            <v-slide-x-transition mode="out-in">
                <router-view />
            </v-slide-x-transition>
        </v-main>
        <app-floating-btn />
        <app-drawer v-model="$app.drawer" />
        <app-menu v-model="$app.menu" v-bind="$app.menuProps" />
        <app-modal v-model="$app.modal" v-bind="$app.modalProps" />
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
*/
