<template>
    <v-app>
        <app-header />
        <v-main>
            <router-view />
        </v-main>
        <app-modal v-model="$app.modal" />
        <app-drawer v-model="$app.drawer" />
    </v-app>
</template>
<script>
import AppHeader from '@/layouts/AppHeader.vue'
import AppDrawer from '@/layouts/AppDrawer.vue'
export default {
    name: 'AppLayout',
    components: {
        AppHeader,
        AppDrawer,
    },
}
</script>
<style scoped lang="scss"></style>
