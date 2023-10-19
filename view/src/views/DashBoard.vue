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
                        사이드바
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: 'DashBoard',
}
</script>
