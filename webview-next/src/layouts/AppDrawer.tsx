import { useAppStore } from '@/stores/app'
import { defineComponent } from 'vue'
import DiaryCategory from '@/components/diary/DiaryCategory'
import '@/layouts/AppDrawer.scoped.scss'
import { useDiaryStore } from '@/stores/diary'
const appStore = useAppStore()
export default defineComponent({
    name: 'AppDrawer',
    components: {
        DiaryCategory
    },
    setup() {
        const diaryStore = useDiaryStore()
        return () => (
            <v-navigation-drawer
                class="app-drawer"
                modelValue={appStore.getDrawer}
                onUpdate:modelValue={appStore.toggleDrawer}
                clipped
                mobile-breakpoint="0"
            >
                <v-card class="ad-card" tile flat>
                    <v-row class="ad-row-category" no-gutters>
                        <v-col>
                            <diary-category
                                title={`전체 (${diaryStore.cntDiaries})`}
                                items={diaryStore.treeDiaries}
                                is-dir
                                class="pa-2"
                            />
                        </v-col>
                    </v-row>
                </v-card>
            </v-navigation-drawer>
        )
    }
})
