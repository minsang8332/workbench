import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/layouts/AppHeader'
import AppDrawer from '@/layouts/AppDrawer'
import AppModal from '@/layouts/AppModal'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'AppLayout',
    components: {
        AppHeader,
        AppDrawer,
        AppModal
    },
    setup() {
        const appStore = useAppStore()
        return () => (
            <v-app>
                <app-header />
                <v-main>
                    <app-drawer />
                    <RouterView />
                </v-main>
                <app-modal
                    value={appStore.state.modal}
                    message={appStore.state.modalProps.message}
                    ok={appStore.state.modalProps.ok}
                    onUpdate:modelValue={appStore.toggleModal}
                />
            </v-app>
        )
    }
})
