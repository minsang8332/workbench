import { defineComponent } from 'vue'
import DiaryMenu from '@/components/diary/DiaryMenu'
import DiaryTree from '@/components/diary/DiaryTree'
import { useDiaryStore } from '@/stores/diary'
import './DiaryDrawer.scoped.scss'
export default defineComponent({
    name: 'DiaryDrawer',
    components: {
        DiaryMenu,
        DiaryTree
    },
    setup() {
        const diaryStore = useDiaryStore()
        return () => (
            <>
                <diary-menu
                    {...diaryStore.state.menuProps}
                    model-value={diaryStore.state.menu}
                    onUpdate:modelValue={diaryStore.toggleMenu}
                />
                <v-navigation-drawer
                    class="diary-drawer"
                    modelValue={diaryStore.getDrawer}
                    onUpdate:modelValue={diaryStore.toggleDrawer}
                    clipped
                    mobile-breakpoint="0"
                >
                    <v-card class="diary-drawer__container" tile flat>
                        <v-row class="scroll-card" no-gutters>
                            <v-col>
                                <diary-tree
                                    title={`전체 (${diaryStore.cntDiaries})`}
                                    items={diaryStore.treeDiaries}
                                    is-dir
                                    class="pa-2"
                                />
                            </v-col>
                        </v-row>
                    </v-card>
                </v-navigation-drawer>
            </>
        )
    }
})
