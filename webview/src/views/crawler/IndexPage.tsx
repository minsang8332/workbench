import { defineComponent, onBeforeMount } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import './IndexPage.scoped.scss'
export default defineComponent({
    name: 'CrawlerPage',
    setup() {
        const router = useRouter()
        const route = useRoute()
        const appStore = useAppStore()
        const { loadWorker } = useCrawler(crawlerState)
        const onBack = () => {
            if (window.history && window.history.length > 1) {
                router.back()
                return
            }
            router.replace({ name: 'crawler' }).catch((e) => e)
        }
        onBeforeRouteUpdate(() => {
            loadWorker()
        })
        onBeforeMount(() => {
            loadWorker()
        })
        return () => (
            <article class="crawler-page flex flex-col h-full">
                <div class="crawler-page__header flex justify-between items-center">
                    <div class="flex items-center">
                        <button
                            type="button"
                            class="btn-drawer flex justify-center items-center"
                            onClick={() => appStore.toggleDrawer()}
                        >
                            <i class="mdi mdi-robot"></i>
                        </button>
                        <button type="button" class="btn-nav">
                            <b>웹 자동화</b>
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
                {route.name == 'crawler' ? (
                    <div class="crawler-page__content flex flex-col gap-4">
                        <b class="text-title">실행내역</b>
                        <p class="text-desc">자동화 세트 실행 내역 목록입니다.</p>
                    </div>
                ) : (
                    <div class="flex-1">
                        <router-view />
                    </div>
                )}
            </article>
        )
    }
})
