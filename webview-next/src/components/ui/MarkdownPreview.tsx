import { defineComponent, computed, unref } from 'vue'
import type { PropType } from 'vue'
import { marked } from 'marked'
import 'github-markdown-css'
import './MarkdownPreview.scoped.scss'
export default defineComponent({
    name: 'MarkdownPreview',
    props: {
        value: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props) {
        const preview = computed(() => marked.parse(props.value))
        return () => <div v-html={unref(preview)} class="markdown-preview markdown-body" />
    }
})
