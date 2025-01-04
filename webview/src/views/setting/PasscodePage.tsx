import { reactive, defineComponent } from 'vue'
import SwitchField from '@/components/form/SwitchField'
import './PasscodePage.scoped.scss'
interface IPasscodePageState {
    active: false
}
export default defineComponent({
    name: 'PasscodePage',
    components: {
        SwitchField
    },
    setup() {
        const state = reactive<IPasscodePageState>({
            active: false
        })
        return () => (
            <article class="passcode-page">
                <div class="passcode-page__content flex justify-start">
                    <switch-field v-model={state.active} />
                </div>
            </article>
        )
    }
})
