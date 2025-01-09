import { defineComponent, onBeforeMount, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import SwitchField from '@/components/form/SwitchField'
import './PasscodePage.scoped.scss'
export default defineComponent({
    name: 'PasscodePage',
    components: {
        SwitchField
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
                })
        const onUpdateActivePasscode = () => {
            appStore
                .blocking(() => settingStore.activatePasscode(!settingStore.getActivePasscode))
                .then((response) => {
                    if (!response.result) {
                        $toast.error(new Error(response.message))
                        return
                    }
                    $toast.success(
                        `잠금 ${response.data.active ? '활성화' : '비활성화'} 되었습니다.`
                    )
                })
                .catch((e) => $toast.error(e))
                .finally(onLoad)
        }
        onBeforeMount(() => {
            onLoad()
        })
        return () => (
            <article class="passcode-page">
                <div class="passcode-page__content flex flex-col gap-4">
                    <div class="passcode-page__content-item">
                        <div class="flex justify-between items-center">
                            <b class="text-label">
                                {settingStore.getActivePasscode
                                    ? '잠금 활성화 상태 입니다.'
                                    : '잠금 비활성화 상태 입니다.'}
                            </b>
                            <switch-field
                                model-value={settingStore.getActivePasscode}
                                disabled={appStore.getDisabled}
                                onUpdate:model-value={onUpdateActivePasscode}
                            />
                        </div>
                    </div>
                    <div
                        class="passcode-page__content-item before-change-passcode flex justify-between items-center"
                        onClick={() => router.push({ name: 'setting-change-passcode' })}
                    >
                        <b class="text-label">패스코드 변경하기</b>
                        <i class="mdi mdi-chevron-right"></i>
                    </div>
                </div>
            </article>
        )
    }
})
