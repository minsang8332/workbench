import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import './DockMenu.scoped.scss'
export default defineComponent({
    name: 'DockMenu',
    setup() {
        const appStore = useAppStore()
        const settingStore = useSettingStore()
        const router = useRouter()
        const onLock = () => {
            router.push({ name: 'lock' }).catch((e) => e)
        }
        const onExit = () => {
            appStore.toggleModal(true, {
                message: '어플리케이션을 종료 하시겠습니까 ?',
                ok() {
                    appStore.powerOff()
                }
            })
        }
        return () => (
            <footer class="dock-menu flex justify-between items-center">
                <div class="dock-menu__left flex justify-center items-center gap-2 h-full">
                    <button
                        type="button"
                        class="btn-diary flex justify-center items-center"
                        onClick={() => router.push({ name: 'diary' })}
                    >
                        <i class="mdi mdi-book-open-page-variant"></i>
                        <span class="tooltip">일지 작성</span>
                    </button>
                    <button
                        type="button"
                        class="btn-todo flex justify-center items-center"
                        onClick={() => router.push({ name: 'todo' })}
                    >
                        <i class="mdi mdi-flag-variant" />
                        <span class="tooltip">해야 할 일</span>
                    </button>
                    <button
                        type="button"
                        class="btn-crawler flex justify-center items-center"
                        onClick={() => router.push({ name: 'worker' })}
                    >
                        <i class="mdi mdi-robot" />
                        <span class="tooltip">웹 자동화</span>
                    </button>
                </div>
                <div class="dock-menu__right flex justify-center items-center gap-2 h-full">
                    {settingStore.getActivePasscode && (
                        <button
                            type="button"
                            class="btn-lock flex justify-center items-center"
                            onClick={onLock}
                        >
                            <i class="mdi mdi-lock" />
                            <span class="tooltip">잠금</span>
                        </button>
                    )}
                    <button
                        type="button"
                        class="btn-setting flex justify-center items-center"
                        onClick={() => router.push({ name: 'setting' })}
                    >
                        <i class="mdi mdi-cog"></i>
                        <span class="tooltip">환경설정</span>
                    </button>
                    <button
                        type="button"
                        class="btn-exit flex justify-center items-center"
                        onClick={onExit}
                    >
                        <i class="mdi mdi-power" />
                        <span class="tooltip">종료하기</span>
                    </button>
                </div>
            </footer>
        )
    }
})
