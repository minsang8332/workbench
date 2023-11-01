<template>
    <v-navigation-drawer
        clipped
        app
        expand-on-hover
        mobile-breakpoint="0"
        :value="value"
        @input="onInput"
    >
        <app-category label="전체" :depth="1" :items="items" />
    </v-navigation-drawer>
</template>
<script>
import AppCategory from '@/layouts/AppCategory.vue'
import mock from '@/mock/category'
export default {
    name: 'AppDrawer',
    components: {
        AppCategory,
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const items = mock.getCategory()
        return {
            items,
        }
    },
    methods: {
        onInput(value) {
            this.$emit('input', value)
        },
    },
}
</script>
