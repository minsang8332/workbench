import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DiaryCard from '@/components/diary/DiaryCard'
import { useDiaryStore } from '@/stores/diary'
import '@/views/DiaryPage.scoped.scss'
export default defineComponent({
    name: 'DiaryPage',
    components: {
        DiaryCard
    },
    setup() {
        const router = useRouter()
        const diaryStore = useDiaryStore()
        const recentDiaries = ref<IDiaryWithPreview[]>([])
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

        watch(
            () => diaryStore.getDiaries,
            () =>
                diaryStore
                    .loadDiariesWithPreview()
                    .then((value: IDiaryWithPreview[]) => {
                        recentDiaries.value = value
                    })
                    .catch((e) => console.error(e))
        )
        onMounted(() => {
            diaryStore
                .loadDiaries()
                .then(() => {
                    diaryStore
                        .loadDiariesWithPreview()
                        .then((value: IDiaryWithPreview[]) => {
                            recentDiaries.value = value
                        })
                        .catch((e) => console.error(e))
                })
                .catch((e) => console.error(e))
        })
        return () => (
            <v-container class="diary-page pa-0" fluid>
                <v-card flat>
                    <v-row no-gutters>
                        <v-col class="diary-page__header">
                            <v-btn
                                variant="text"
                                onClick={diaryStore.toggleDrawer}
                            >
                                <v-icon class="ico-menu">fa-solid fa-bars</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">문서 탐색</p>
                                </v-tooltip>
                            </v-btn>
                            <h3 class="text-title">최근 작성한 문서</h3>
                        </v-col>
                    </v-row>
                    <v-divider class="pa-1" />
                    <v-row no-gutters>
                        {recentDiaries.value.map((diary) => (
                            <v-col cols="12" md="4" class="pa-4">
                                <div class="diary-page__recently-items">
                                    <diary-card {...diary} onclick={() => onMoveDiary(diary)} />
                                </div>
                            </v-col>
                        ))}
                    </v-row>
                </v-card>
            </v-container>
        )
    }
})
