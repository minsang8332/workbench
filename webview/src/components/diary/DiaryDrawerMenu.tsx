import { defineComponent } from 'vue'
import DiaryFile from '@/components/diary/DiaryFile'
import './DiaryDrawerMenu.scoped.scss'
export default defineComponent({
    name: 'DiaryDrawerMenu',
    components: {
        DiaryFile
    },
    setup() {
        return () => (
            <div class="diary-drawer-menu">
                <diary-file />
            </div>
        )
    }
})
