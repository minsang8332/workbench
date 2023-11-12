<template>
    <router-view />
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'App',
    methods: {
        ...mapActions('app', ['waitUpdate', 'installUpdate']),
        ...mapActions('markdown', ['loadMarkdowns']),
        onInit() {
            const app = this
            // 문서 목록
            this.loadMarkdowns().catch((e) => e)
            // 앱 업데이트 확인
            this.waitUpdate()
                .then(() => {
                    this.$app.showModal({
                        message: [
                            '새로운 버전이 업데이트 되었습니다.',
                            '업데이트 하시겠습니까 ?',
                        ],
                        ok() {
                            app.installUpdate()
                            app.$app.hideModal()
                        },
                    })
                })
                .catch((e) => e)
        },
    },
    mounted() {
        this.onInit()
    },
}
</script>
