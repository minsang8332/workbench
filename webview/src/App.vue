<template>
    <router-view />
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'App',
    methods: {
        ...mapActions('category', ['loadCategory']),
    },
    mounted() {
        this.loadCategory()
    },
}
</script>
