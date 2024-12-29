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
                    <div class="diary-drawer__content">
                        <diary-tree
                            title={`전체 (${diaryStore.cntDiaries})`}
                            items={diaryStore.treeDiaries}
                            is-dir
                            class="pa-2"
                        />
                    </div>
                </v-navigation-drawer>
            </>
        )
    }
})
