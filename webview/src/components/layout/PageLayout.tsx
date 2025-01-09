import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import DrawerMenu from '@/components/ui/DrawerMenu'
import DockMenu from '@/components/ui/DockMenu'
import ContextMenu from '@/components/ui/ContextMenu'
import ModalDialog from '@/components//ui/ModalDialog'
import OverlayVideo from '@/components/ui/OverlayVideo'
import './PageLayout.socped.scss'
export default defineComponent({
    name: 'PageLayout',
    components: {
        DockMenu,
        DrawerMenu,
        ContextMenu,
        ModalDialog,
        OverlayVideo
    },
    setup() {
        const route = useRoute()
        const appStore = useAppStore()
        return () => (
            <main class="page-layout flex justify-between">
                <modal-dialog
                    {...appStore.state.modalProps}
                    model-value={appStore.state.modal}
                    onUpdate:modelValue={appStore.toggleModal}
                    max-width="30vw"
                />
                <context-menu
                    {...appStore.state.menuProps}
                    model-value={appStore.state.menu}
                    onUpdate:modelValue={appStore.toggleMenu}
                />
                {route.matched.some((r) => r && r.components && r.components.drawer) && (
                    <drawer-menu class={appStore.getDrawer == true && 'mr-1'}>
                        <router-view name="drawer" />
                    </drawer-menu>
                )}
                <section class="flex flex-col grow">
                    <router-view />
                    <dock-menu />
                </section>
                <overlay-video video />
            </main>
        )
    }
})
