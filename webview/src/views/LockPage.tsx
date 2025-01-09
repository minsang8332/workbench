import { defineComponent, inject, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import PasscodeForm from '@/components/setting/PasscodeForm'
export default defineComponent({
    name: 'LockPage',
    components: {
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
                .then((response) => {
                    response.data.empty == true ||
                        (response.data.active == false &&
                            router.replace({ name: 'authorized' }).catch((e) => e))
                })
                .catch((e) => {
                    e.message = '패스코드 설정 정보를 불러올 수 없습니다.'
                    $toast.error(e)
                })
        const onVerifyPasscode = async (passcode: string) => {
            try {
                const response = await appStore.blocking(() =>
                    settingStore.verifyPasscode(passcode)
                )
                if (!(response && response.result)) {
                    throw new Error('패스워드가 일치하지 않습니다')
                }
                router.replace({ name: 'authorized' }).catch((e) => e)
            } catch (e) {
                $toast.error(e as Error)
            }
        }
        onBeforeMount(() => {
            onLoad()
        })
        return () => (
            <div class="lock-page flex justify-center items-center h-full">
                <div class="w-1/3 h-1/3">
                    <passcode-form title="잠금 상태" class="w-full/2" onSubmit={onVerifyPasscode} />
                </div>
            </div>
        )
    }
})
