import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app'
import './IndexPage.scoped.scss'
export default defineComponent({
    name: 'SettingPage',
    setup() {
        const appStore = useAppStore()
        return () => (
            <article class="setting-page flex flex-col gap-1">
                <div class="setting-page__header flex justify-between items-center">
                    <div class="flex items-center gap-1">
                        <button
                            type="button"
                            class="btn-setting flex justify-center items-center"
                            onClick={() => appStore.toggleDrawer()}
                        >
                            <i class="mdi mdi-cog"></i>
                        </button>
                        <b class="text-title">환경 설정</b>
                    </div>
                    <div class="flex items-center"></div>
                </div>
                <div class="setting-page__content">
                    <router-view />
                </div>
            </article>
        )
    }
})
