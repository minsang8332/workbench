import { defineComponent, computed, unref } from 'vue'
import type { PropType } from 'vue'
import { marked } from 'marked'
import '@/components/diary/DiaryPreview.scoped.scss'
import 'github-markdown-css'
export default defineComponent({
    name: 'DiaryPreview',
    props: {
        value: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props) {
        const preview = computed(() => marked.parse(props.value))
        return () => <div v-html={unref(preview)} class="diary-preview markdown-body" />
    }
})
