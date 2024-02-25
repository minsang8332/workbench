import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/layouts/AppHeader'
import AppDrawer from '@/layouts/AppDrawer'
import AppModal from '@/layouts/AppModal'
import AppMenu from '@/layouts/AppMenu'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'AppLayout',
    components: {
        AppHeader,
        AppDrawer,
        AppModal,
        AppMenu
    },
    setup() {
        const appStore = useAppStore()
        return () => (
            <v-app>
                <app-header />
                <app-drawer />
                <app-menu
                    {...appStore.state.menuProps}
                    model-value={appStore.state.menu}
                    onUpdate:modelValue={appStore.toggleMenu}
                />
                <v-main>
                    <RouterView />
                </v-main>
                <app-modal
                    {...appStore.state.modalProps}
                    model-value={appStore.state.modal}
                    onUpdate:modelValue={appStore.toggleModal}
                />
            </v-app>
        )
    }
})
