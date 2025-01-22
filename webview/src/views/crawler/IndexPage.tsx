import _ from 'lodash'
import dayjs from 'dayjs'
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useCrawlerStore } from '@/stores/crawler'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import { CRAWLER_STATUS } from '@/costants/model'
import DataTable from '@/components/ui/DataTable'
import './IndexPage.scoped.scss'
export default defineComponent({
    name: 'CrawlerPage',
    components: {
        DataTable
    },
    setup() {
        const router = useRouter()
        const route = useRoute()
        const appStore = useAppStore()
        const { getHistories } = storeToRefs(useCrawlerStore())
        const { loadWorker, loadHistories, onHistoryContextMenu } = useCrawler(crawlerState)
        const onBack = () => {
            if (window.history && window.history.length > 1) {
                router.back()
                return
            }
            router.replace({ name: 'crawler' }).catch((e) => e)
        }
        const historyRows = computed(() => {
            let rows = getHistories.value.reduce((acc: any, history) => {
                acc.push({
                    label: history.label,
                    status: _.isNumber(history.status) ? CRAWLER_STATUS[history.status] : null,
                    round: history.round,
                    totalRound: history.totalRound,
                    message: history.message,
                    endedAt: dayjs(history.endedAt).isValid()
                        ? dayjs(history.endedAt).format('YYYY-MM-DD HH:mm:ss')
                        : null
                })
                return acc
            }, [])
            rows = _.sortBy(rows, (row) => row.endedAt).reverse()
            return rows
        })
        onBeforeMount(() => {
            loadWorker()
            loadHistories()
        })
        return () => (
            <article
                class={{
                    'crawler-page flex flex-col h-full': true,
                    'crawler-page--drawer': appStore.getDrawer
                }}
            >
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
                    <div
                        class="crawler-page__content flex flex-1 flex-col gap-4"
                        onMouseup={(e) => onHistoryContextMenu(e)}
                    >
                        <b class="text-title">실행 내역</b>
                        <p class="text-desc">
                            자동화 실행 내역 목록입니다. 좌측 메뉴에서 [자동화 생성] 하여 실행해
                            주세요.
                        </p>
                        <data-table
                            columns={[
                                { field: 'label', label: '자동화명' },
                                { field: 'status', label: '상태' },
                                { field: 'round', label: '진행 회차' },
                                { field: 'totalRound', label: '총 회차' },
                                { field: 'message', label: '메시지' },
                                { field: 'endedAt', label: '종료시점' }
                            ]}
                            rows={historyRows.value}
                        />
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
