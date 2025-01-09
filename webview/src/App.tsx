import { defineComponent, onBeforeMount } from 'vue'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
export default defineComponent({
    name: 'App',
    setup() {
        const appStore = useAppStore()
        const settingStore = useSettingStore()
        onBeforeMount(() => {
            // 앱 업데이트
            appStore
                .waitUpdate()
                .then(() => {
                    appStore.toggleModal(true, {
                        message: ['새로운 버전이 업데이트 되었습니다.', '업데이트 하시겠습니까 ?'],
                        ok() {
                            appStore.installUpdate()
                            appStore.toggleModal(false)
                        }
                    })
                })
                .catch((e: Error) => e)
            // 패스코드 사용 확인
            settingStore.loadPasscode().catch((e) => e)
        })
        return () => <router-view />
    }
})
