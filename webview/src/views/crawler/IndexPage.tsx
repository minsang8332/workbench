import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import WorkerForm from '@/components/crawler/WorkerForm'
import './IndexPage.scoped.scss'
interface ICrawlerPageState {}
export default defineComponent({
    name: 'CrawlerPage',
    components: {
        WorkerForm
    },
    setup() {
        const router = useRouter()
        const appStore = useAppStore()
        const state = reactive<ICrawlerPageState>({})
        const onBack = () => {
            if (window.history && window.history.length > 1) {
                router.back()
                return
            }
            router.replace({ name: 'crawler' }).catch((e) => e)
        }
        return () => (
            <article class="crawler-page flex flex-col">
                <div class="crawler-page__header flex justify-between items-center">
                    <div class="flex items-center gap-1">
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
                <div class="crawler-page__content"></div>
            </article>
        )
    }
})
