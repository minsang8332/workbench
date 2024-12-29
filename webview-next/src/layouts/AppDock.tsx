import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import '@/layouts/AppDock.scoped.scss'
export default defineComponent({
    name: 'AppDock',
    setup() {
        const appStore = useAppStore()
        const router = useRouter()
        const onShutdown = () => {
            appStore.toggleModal(true, {
                message: '어플리케이션을 종료 하시겠습니까 ?',
                ok() {
                    appStore.powerOff()
                }
            })
        }
        return () => (
            <footer class="app-dock native-drag flex justify-between items-center px-2">
                <div class="app-dock__left flex justify-center items-center gap-2 full-height">
                    <button type="button" class="skip-native-drag row-center" onClick={() => router.replace({ name: 'todo' })}>
                        <i class="mdi mdi-list-box" />
                        <span class="tooltip">해야 할 일</span>
                    </button>
                    <button type="button" class="skip-native-drag row-center" onClick={() => router.replace({ name: 'diary' })}>
                        <i class="mdi mdi-file-edit-outline" />
                        <span class="tooltip">문서쓰기</span>
                    </button>
                </div>
                <div class="app-dock__right flex flex-col justify-center full-height">
                    <button type="button" class="btn-shutdown skip-native-drag row-center" onClick={onShutdown}>
                        <i class="mdi mdi-power" />
                        <span class="tooltip">종료하기</span>
                    </button>
                </div>
            </footer>
        )
    }
})
