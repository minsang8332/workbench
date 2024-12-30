import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app'
import DrawerMenu from '@/components/ui/DrawerMenu'
import DockMenu from '@/components/ui/DockMenu'
import ContextMenu from '@/components/ui/ContextMenu'
import './PageLayout.socped.scss'
export default defineComponent({
    name: 'PageLayout',
    components: {
        DockMenu,
        DrawerMenu,
        ContextMenu
    },
    setup() {
        const appStore = useAppStore()
        /*
            <app-modal
                {...appStore.state.modalProps}
                model-value={appStore.state.modal}
                onUpdate:modelValue={appStore.toggleModal}
            />
        */
        return () => (
            <main class="page-layout flex justify-between">
                <context-menu
                    {...appStore.state.menuProps}
                    model-value={appStore.state.menu}
                    onUpdate:modelValue={appStore.toggleMenu}
                />
                <section class="flex-shrink-1">
                    <drawer-menu>
                        <router-view name="drawer" />
                    </drawer-menu>
                </section>
                <section class="flex flex-col flex-grow-1">
                    <router-view />
                    <dock-menu />
                </section>
            </main>
        )
    }
})
