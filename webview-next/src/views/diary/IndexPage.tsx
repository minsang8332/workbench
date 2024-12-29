import { defineComponent, onMounted, ref, unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import DiaryCard from '@/components/diary/DiaryCard'
import DiaryDrawer from '@/components/diary/DiaryDrawer'
import '@/views/diary/IndexPage.scoped.scss'
export default defineComponent({
    name: 'DiaryPage',
    components: {
        DiaryCard,
        DiaryDrawer,
    },
    setup() {
        const router = useRouter()
        const diaryStore = useDiaryStore()
        const recentDiaries = ref<IDiaryWithText[]>([])
        const onMoveDiary = (diary: IDiary) => {
            router
                .replace({
                    name: 'diary-editor',
                    params: {
                        path: diary.path
                    }
                })
                .catch((e) => e)
        }
        onMounted(() => {
            diaryStore.loadDiaries()
        })
        watch(() => diaryStore.recentDiaries, async (newValue) => {
            recentDiaries.value = await Promise.all(newValue.map(async (diary: IDiary) => {
                let text = ''
                try {
                    const response = await diaryStore.readDiary({ target: diary.path })
                    text = response.text ?? ''
                } catch (e) {
                    console.error(e)
                }
                return {...diary, text }
            }))
        })
        return () => (
            <article class="diary-page">
                <diary-drawer />
                <div class="diary-page__header row-between px-2">
                    <div class="flex items-center">
                        <button type="button" class="btn-search-diary" onClick={() => diaryStore.toggleDrawer()}>
                            <i class="mdi mdi-menu" />
                            <span class="tooltip tooltip-bottom">문서 탐색</span>
                        </button>
                        <h3 class="text-title">최근 작성한 문서</h3>
                    </div>
                    <div class="flex items-center">
                        <button type="button" class="btn-open-diary" onClick={diaryStore.dirDiary}>
                            <i class="mdi mdi-folder" />
                            <span class="tooltip tooltip-bottom">문서 열기</span>
                        </button>
                    </div>
                </div>
                <div class="diary-page__content">
                    {
                        unref(recentDiaries).map((diary: IDiaryWithText) => (
                            <div class="diary-page__content-item">
                                <diary-card {...diary} onclick={() => onMoveDiary(diary)} />
                            </div>
                        ))
                    }
                </div>
            </article>
        )
    }
})
