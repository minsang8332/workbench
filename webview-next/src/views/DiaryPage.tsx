import { defineComponent, onMounted, ref, unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import DiaryCard from '@/components/diary/DiaryCard'
import DiaryDrawer from '@/components/diary/DiaryDrawer'
import '@/views/DiaryPage.scoped.scss'
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
            <v-container class="diary-page pa-0" fluid>
                <diary-drawer />
                <v-card flat>
                    <v-row class="diary-page__header" no-gutters>
                        <v-col class="d-flex align-center" align-self="center">
                            <v-btn
                                variant="text"
                                size="large"
                                onClick={diaryStore.toggleDrawer}
                            >
                                <v-icon class="ico-menu">mdi:mdi-menu</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">문서 탐색</p>
                                </v-tooltip>
                            </v-btn>
                            <h3 class="text-title">최근 작성한 문서</h3>
                        </v-col>
                        <v-col align="end" align-self="center">
                            <v-btn class="btn-folder" size="large" variant="text" onClick={diaryStore.dirDiary}>
                                <v-icon class="ico-folder">mdi:mdi-folder</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">문서 열기</p>
                                </v-tooltip>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider class="pa-1" />
                    <v-row class="px-2" no-gutters>
                        {
                            unref(recentDiaries).map((diary: IDiaryWithText) => (
                                <v-col cols="12" md="4" class="pa-4">
                                    <div class="diary-page__recently-items">
                                        <diary-card {...diary} onclick={() => onMoveDiary(diary)} />
                                    </div>
                                </v-col>
                            ))
                        }
                    </v-row>
                </v-card>
            </v-container>
        )
    }
})
