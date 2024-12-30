import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import './DockMenu.scoped.scss'
export default defineComponent({
    name: 'DockMenu',
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
            <footer class="dock-menu native-drag flex justify-between items-center px-2">
                <div class="dock-menu__left flex justify-center items-center gap-2 full-height">
                    <button
                        type="button"
                        class="btn-diary flex justify-center items-center"
                        onClick={() => router.replace({ name: 'diary' })}
                    >
                        <i class="mdi mdi-book-open-page-variant"></i>
                        <span class="tooltip">일지 작성</span>
                    </button>
                    <button
                        type="button"
                        class="btn-todo flex justify-center items-center"
                        onClick={() => router.replace({ name: 'todo' })}
                    >
                        <i class="mdi mdi-flag-variant" />
                        <span class="tooltip">해야 할 일</span>
                    </button>
                </div>
                <div class="dock-menu__right flex justify-center items-center full-height">
                    <button
                        type="button"
                        class="btn-shutdown flex justify-center items-center"
                        onClick={onShutdown}
                    >
                        <i class="mdi mdi-power" />
                        <span class="tooltip">종료하기</span>
                    </button>
                </div>
            </footer>
        )
    }
})
