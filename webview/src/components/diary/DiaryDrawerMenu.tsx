import { defineComponent } from 'vue'
import { useDiaryStore } from '@/stores/diary'
import DiaryTree from '@/components/diary/DiaryTree'
import './DiaryDrawerMenu.scoped.scss'
export default defineComponent({
    name: 'DiaryDrawerMenu',
    components: {
        DiaryTree
    },
    setup() {
        const diaryStore = useDiaryStore()
        return () => (
            <div class="diary-drawer-menu">
                <diary-tree
                    title={`전체 (${diaryStore.cntDiaries})`}
                    is-dir
                    items={diaryStore.treeDiaries}
                />
            </div>
        )
    }
})
