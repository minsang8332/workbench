<template>
    <v-navigation-drawer app :value="value" @input="onInput">
        <!--  -->
    </v-navigation-drawer>
</template>
<script>
export default {
    name: 'AppDrawer',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onInput(value) {
            this.$emit('input', value)
        },
    },
}
</script>
