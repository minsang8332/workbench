import { defineComponent, type PropType } from 'vue'
import TextField from '@/components/form/TextField'
import './HistoryForm.scoped.scss'
export default defineComponent({
    name: 'HistoryForm',
    components: {
        TextField
    },
    props: {
        results: {
            type: Array as PropType<string[]>,
            default: () => []
        }
    },
    setup(props) {
        const nl2br = (str = '') => str.trim().replace(/\n/g, '<br>')
        return () => (
            <form class="history-form flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div class="history-form__content">
                    <div class="history-result flex flex-col gap-2">
                        {props.results.map((result, i) => (
                            <div class="history-result__item flex flex-col gap-2">
                                <b>스크랩 데이터 {i + 1}</b>
                                <p v-html={nl2br(result)} class="result" />
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        )
    }
})
