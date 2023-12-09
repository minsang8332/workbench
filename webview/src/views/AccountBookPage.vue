<template>
    <v-container class="account-book-page" fluid>
        <v-card flat>
            <v-row class="pa-2" no-gutters>
                <v-col>
                    <h1 class="text-title">매출 장부</h1>
                </v-col>
            </v-row>
            <v-divider class="pa-1" />
            <v-row no-gutters>
                <v-col>
                    {{ getAccountBooks }}
                </v-col>
                <v-col>
                    <v-btn @click="onClickAdd">등록</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'DashboardPage',
    computed: {
        ...mapGetters('account-book', ['getAccountBooks']),
    },
    methods: {
        ...mapActions('account-book', ['loadAccountBooks']),
        onClickAdd() {},
    },
    mounted() {
        this.loadAccountBooks().catch(() =>
            this.$toast.error({
                message: '매출장부를 불러올 수 없습니다.',
            })
        )
    },
}
</script>
<style lang="scss" scoped>
.dashboard-page::v-deep {
    .div-preview-card {
        height: 100%;
        min-height: 320px;
        max-height: 320px;
        width: 100%;
    }
}
</style>
