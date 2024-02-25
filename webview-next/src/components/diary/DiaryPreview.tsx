import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import '@/components/diary/DiaryPreview.scoped.scss'
import 'github-markdown-css'
export default defineComponent({
    name: 'DiaryPreview',
    props: {
        preview: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props) {
        return () => <div v-html={props.preview} class="diary-preview markdown-body" />
    }
})
