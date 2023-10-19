<template>
    <vue-element-loading :active="active" :is-full-screen="full" />
</template>
<script>
export default {
    name: 'AppLoading',
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        full: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
