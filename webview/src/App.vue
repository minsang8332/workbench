<template>
    <router-view />
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'App',
    methods: {
        ...mapActions('markdown', ['loadMarkdowns']),
    },
    mounted() {
        this.loadMarkdowns().catch((e) => e)
    },
}
</script>
