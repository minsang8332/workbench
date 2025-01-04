import { defineComponent, onBeforeMount, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import PasscodeForm from '@/components/setting/PasscodeForm'
import SwitchField from '@/components/form/SwitchField'
export default defineComponent({
    name: 'UpdatePasscodePage',
    components: {
        SwitchField,
        PasscodeForm
    },
    setup() {
        const $toast = inject('toast') as IToastPlugin
        const router = useRouter()
        const appStore = useAppStore()
        const settingStore = useSettingStore()
        const onLoad = () =>
            appStore
                .blocking(() => settingStore.loadPasscode())
                .catch((e) => {
                    e.message = '패스코드 설정 정보를 불러올 수 없습니다.'
                    $toast.error(e)
                    router.replace({ name: 'change-passcode' })
                })
        const onChangePasscode = (passcode: string) => {
            appStore
                .blocking(() => settingStore.changePasscode(passcode))
                .then((result) => {
                    result && $toast.success('정상적으로 패스코드를 변경했습니다.')
                    router.push({ name: 'active-passcode' })
                })
                .catch((e) => {
                    e.message = '패스코드를 변경 할 수 없습니다.'
                    $toast.error(e)
                })
        }
        onBeforeMount(() => {
            onLoad()
        })
        return () => (
            <article class="change-passcode-page">
                <div class="change-passcode-page__content flex flex-col justify-center items-center">
                    <div class="w-1/2">
                        <passcode-form
                            title="새로운 패스코드"
                            description="4자리 숫자를 입력해 주세요"
                            onSubmit={onChangePasscode}
                        />
                    </div>
                </div>
            </article>
        )
    }
})
