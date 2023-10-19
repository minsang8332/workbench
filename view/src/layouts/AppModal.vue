<template>
    <v-dialog content-class="app-modal" :value="value" @input="onInput">
        <v-card class="am-card" flat>
            <v-row no-gutters>
                <v-col> 모달 </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'AppModal',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onInput() {
            console.log(this.value)
            this.$emit('input', !this.value)
        },
    },
}
</script>
<style scoped lang="scss">
::v-deep .app-modal {
    width: 50%;
    .am-card {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
}
</style>
