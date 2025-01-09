import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import './IndexPage.scoped.scss'
export default defineComponent({
    name: 'SettingPage',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const appStore = useAppStore()
        const onBack = () => {
            if (window.history && window.history.length > 1) {
                router.back()
                return
            }
            router.replace({ name: 'setting' }).catch((e) => e)
        }
        return () => (
            <article class="setting-page flex flex-col">
                <div class="setting-page__header flex justify-between items-center">
                    <div class="flex items-center gap-1">
                        <button
                            type="button"
                            class="btn-setting flex justify-center items-center"
                            onClick={() => appStore.toggleDrawer()}
                        >
                            <i class="mdi mdi-cog"></i>
                        </button>
                        <button type="button" class="btn-nav">
                            <b>환경설정</b>
                        </button>
                        {route.meta.title && (
                            <>
                                <i class="mdi mdi-chevron-right"></i>
                                <button type="button" class="btn-nav">
                                    <b>{route.meta.title}</b>
                                </button>
                            </>
                        )}
                    </div>
                    <div>
                        <button
                            type="button"
                            class="btn-back flex justify-center items-center"
                            onClick={onBack}
                        >
                            <i class="mdi mdi-arrow-left" />
                            <span class="tooltip tooltip-bottom">뒤로 가기</span>
                        </button>
                    </div>
                </div>
                <div class="setting-page__content flex flex-col gap-2">
                    <div class="introduce flex flex-col gap-4">
                        <b class="text-title">{route.meta.title}</b>
                        <p class="text-desc">{route.meta.desc}</p>
                    </div>
                    <div class="inner-page">
                        <router-view />
                    </div>
                </div>
            </article>
        )
    }
})
