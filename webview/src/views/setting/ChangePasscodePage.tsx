import { reactive, defineComponent, onBeforeMount, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import PasscodeForm from '@/components/setting/PasscodeForm'
import SwitchField from '@/components/form/SwitchField'
interface IChangePasscodePageState {
    verified: boolean
}
export default defineComponent({
    name: 'ChangePasscodePage',
    components: {
        SwitchField,
        PasscodeForm
    },
    setup() {
        const $toast = inject('toast') as IToastPlugin
        const router = useRouter()
        const appStore = useAppStore()
        const settingStore = useSettingStore()
        const state = reactive<IChangePasscodePageState>({
            verified: false
        })
        const onLoad = () =>
            appStore
                .blocking(() => settingStore.loadPasscode())
                .catch((e) => {
                    e.message = '패스코드 설정 정보를 불러올 수 없습니다.'
                    $toast.error(e)
                    router.replace({ name: 'change-passcode' })
                })
        const onVerifyPasscode = (passcode: string) => {
            appStore
                .blocking(() => settingStore.verifyPasscode(passcode))
                .then((response) => {
                    if (!response.result) {
                        throw new Error('패스워드가 일치하지 않습니다')
                    }
                    state.verified = true
                })
                .catch((e) => $toast.error(e))
        }
        const onChangePasscode = async (passcode: string) => {
            try {
                const response = await appStore.blocking(() =>
                    settingStore.changePasscode(passcode)
                )
                if (!(response && response.result)) {
                    $toast.error(new Error(response.message))
                    return
                }
                $toast.success('정상적으로 패스코드를 변경했습니다.')
                router.push({ name: 'active-passcode' })
            } catch (e) {
                $toast.error(new Error('패스코드를 변경할 수 없습니다.'))
            }
        }
        onBeforeMount(() => {
            onLoad()
        })
        return () => (
            <article class="change-passcode-page">
                <div class="change-passcode-page__content flex flex-col justify-center items-center">
                    <div class="w-1/2">
                        {state.verified ? (
                            <passcode-form
                                title="새로운 패스코드"
                                description="새로운 패스코드 4자리 숫자를 입력해 주세요"
                                onSubmit={onChangePasscode}
                                key="new-passcoded"
                            />
                        ) : (
                            <passcode-form
                                title="기존 패스코드"
                                description="기존 패스코드 4자리 숫자를 입력해 주세요"
                                onSubmit={onVerifyPasscode}
                                key="old-passcoded"
                            />
                        )}
                    </div>
                </div>
            </article>
        )
    }
})
