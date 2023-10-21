<template>
    <v-container fluid>
        <v-card flat>
            <v-row no-gutters>
                <v-col>
                    <v-btn @click="$app.modal = !$app.modal"> 모달 </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn @click="$app.drawer = !$app.drawer">
                        <v-icon>fas fa-sync</v-icon>
                        <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <span>보통 글씨</span>
            <b>굵은 글씨</b>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: 'DashBoard',
}
</script>
<style lang="scss" scoped></style>
