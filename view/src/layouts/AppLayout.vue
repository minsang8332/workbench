<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
        <app-modal v-model="$modal.value" />
    </v-app>
</template>
<script>
export default {
    name: 'AppLayout',
}
</script>
