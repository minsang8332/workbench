import { defineComponent, onBeforeMount, inject } from 'vue'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import './LayoutPage.scoped.scss'
export default defineComponent({
    name: 'LayoutPage',
    setup() {
        const $toast = inject('toast') as IToastPlugin
        const appStore = useAppStore()
        const settingStore = useSettingStore()
        const onLoad = () =>
            appStore.blocking(() => settingStore.loadOverlayVideos()).catch((e) => e)
        const onUpdateOverlayVideo = () => {
            settingStore
                .updateOverlayVideo()
                .then(
                    (response) =>
                        response.result &&
                        $toast.success('배경화면 (오버레이) 경로가 변경되었습니다.')
                )
                .catch((e) => $toast.error(e))
                .finally(onLoad)
        }
        onBeforeMount(() => {
            onLoad()
        })
        return () => (
            <article class="layout-page">
                <div class="layout-page__content flex flex-col gap-4">
                    <div
                        class="layout-page__content-item flex justify-between items-center"
                        onClick={onUpdateOverlayVideo}
                    >
                        <b class="text-label">배경화면 (오버레이) 경로</b>
                        <i class="mdi mdi-chevron-right"></i>
                    </div>
                </div>
            </article>
        )
    }
})
