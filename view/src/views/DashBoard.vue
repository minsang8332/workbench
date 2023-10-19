<template>
    <v-container fluid>
        <v-card flat>
            <v-row no-gutters>
                <v-col> 대시보드 </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn @click="onTestAppModal"> 공통 모달 열기 </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: 'DashBoard',
    methods: {
        onTestAppModal() {
            this.$modal.show()
        },
    },
}
</script>
