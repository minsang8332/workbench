import _ from 'lodash'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import DiaryCard from '@/components/diary/DiaryCard'
import './IndexPage.scoped.scss'
export default defineComponent({
    name: 'DiaryPage',
    components: {
        DiaryCard
    },
    setup() {
        const router = useRouter()
        const appStore = useAppStore()
        const diaryStore = useDiaryStore()
        const recentDiaries = ref<IDiaryDetail[]>([])
        const onDiaryCard = (diary: IDiary) => {
            router
                .replace({
                    name: 'diary-detail',
                    params: {
                        path: diary.path
                    }
                })
                .catch((e) => e)
        }
        onMounted(() => {
            diaryStore.loadDiaries()
        })
        watch(
            () => diaryStore.recentDiaries,
            async (newValue) => {
                recentDiaries.value = await Promise.all(
                    newValue.map(async (diary: IDiary) => {
                        let text = ''
                        try {
                            text = await diaryStore.readDiary({ filepath: diary.path })
                        } catch (e) {
                            console.error(e)
                        }
                        return { ...diary, text }
                    })
                )
            }
        )
        return () => (
            <article class="diary-page">
                <div class="diary-page__header flex justify-between items-center">
                    <div class="flex items-center">
                        <button
                            type="button"
                            class="btn-tree flex justify-center items-center"
                            onClick={() => appStore.toggleDrawer()}
                        >
                            <i class="mdi mdi-menu" />
                            <span class="tooltip tooltip-bottom">문서 탐색</span>
                        </button>
                        <b class="text-title">최근 작성한 문서</b>
                    </div>
                    <div class="flex items-center">
                        <button
                            type="button"
                            class="btn-docs flex justify-center items-center"
                            onClick={diaryStore.dirDiary}
                        >
                            <i class="mdi mdi-folder" />
                            <span class="tooltip tooltip-bottom">문서 열기</span>
                        </button>
                    </div>
                </div>
                <div class="diary-page__content">
                    {recentDiaries.value.map((diary: IDiaryDetail) => (
                        <div class="diary-page__content-item">
                            <diary-card {...diary} onclick={() => onDiaryCard(diary)} />
                        </div>
                    ))}
                </div>
            </article>
        )
    }
})
