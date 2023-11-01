<template>
    <v-app>
        <app-header />
        <v-main>
            <router-view />
        </v-main>
        <app-floating-btn />
        <app-modal v-model="$app.modal" />
        <app-drawer v-model="$app.drawer" />
    </v-app>
</template>
<script>
import AppHeader from '@/layouts/AppHeader.vue'
import AppDrawer from '@/layouts/AppDrawer.vue'
import AppFloatingBtn from '@/layouts/AppFloatingBtn.vue'
export default {
    name: 'AppLayout',
    components: {
        AppHeader,
        AppDrawer,
        AppFloatingBtn,
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
