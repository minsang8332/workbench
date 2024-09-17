import { defineComponent } from 'vue'
import AppMenu from '@/layouts/AppMenu'
import DiaryTree from '@/components/diary/DiaryTree'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import './DiaryDrawer.scoped.scss'
export default defineComponent({
    name: 'DiaryDrawer',
    components: {
        AppMenu,
        DiaryTree
    },
    setup() {
        const appStore = useAppStore()
        const diaryStore = useDiaryStore()
        return () => (
            <>
                <app-menu
                    {...appStore.state.menuProps}
                    model-value={appStore.state.menu}
                    onUpdate:modelValue={appStore.toggleMenu}
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
