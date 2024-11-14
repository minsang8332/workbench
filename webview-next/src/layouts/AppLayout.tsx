import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AppHeader from '@/layouts/AppHeader'
import AppModal from '@/layouts/AppModal'
export default defineComponent({
    name: 'AppLayout',
    components: {
        AppHeader,
        AppModal,
    },
    setup() {
        const appStore = useAppStore()
        return () => (
            <v-app class="app-layout">
                <app-header />
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
