import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app'
import DockMenu from '@/components/ui/DockMenu'
import ModalDialog from '@/components//ui/ModalDialog'
import OverlayVideo from '@/components/ui/OverlayVideo'
export default defineComponent({
    name: 'PageLayout',
    components: {
        DockMenu,
        ModalDialog,
        OverlayVideo
    },
    setup() {
        const appStore = useAppStore()
        return () => (
            <main class="h-screen max-h-screen w-screen max-w-screen box-border">
                <modal-dialog
                    {...appStore.state.modalProps}
                    model-value={appStore.state.modal}
                    onUpdate:modelValue={appStore.toggleModal}
                    max-width="30vw"
                />
                <router-view />
                <overlay-video />
            </main>
        )
    }
})
