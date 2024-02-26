import { defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DiaryCard from '@/components/diary/DiaryCard'
import { useDiaryStore } from '@/stores/diary'
import '@/views/DashboardPage.scoped.scss'
export default defineComponent({
    name: 'DashboardPage',
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
                    name: 'diary',
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
            <v-container class="dashboard-page pa-0" fluid>
                <v-card flat>
                    <v-row class="pa-2" no-gutters>
                        <v-col>
                            <h1 class="text-title">최근 작성한 문서</h1>
                        </v-col>
                    </v-row>
                    <v-divider class="pa-1" />
                    <v-row no-gutters>
                        {recentDiaries.value.map((diary) => (
                            <v-col cols="12" md="4" class="pa-4">
                                <div class="dp-card-recently-diary">
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
