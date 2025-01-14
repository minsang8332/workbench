import { defineComponent } from 'vue'
import DiaryTree from '@/components/diary/DiaryTree'
import './DiaryDrawerMenu.scoped.scss'
export default defineComponent({
    name: 'DiaryDrawerMenu',
    components: {
        DiaryTree
    },
    setup() {
        return () => (
            <div class="diary-drawer-menu">
                <diary-tree />
            </div>
        )
    }
})
