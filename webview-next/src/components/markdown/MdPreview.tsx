import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { toString } from 'lodash'
import { marked } from 'marked'
import 'github-markdown-css'
import style from '@/components/markdown/MdPreview.module.scss'
export default defineComponent({
    name: 'MdPreview',
    props: {
        text: {
            type: [String, null] as PropType<string | null>,
            default: null
        }
    },
    setup(props) {
        const preview = computed(() => marked(toString(props.text)))
        return () => <div v-html={preview} class={`${style.mdPreview} markdown-body`} />
    }
})
