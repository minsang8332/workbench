import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import AppDock from '@/layouts/AppDock'
import AppModal from '@/layouts/AppModal'
import '@/layouts/AppLayout.socped.scss'
export default defineComponent({
    name: 'AppLayout',
    components: {
        AppDock,
        AppModal,
    },
    setup() {
        const appStore = useAppStore()
        return () => (
            <div>
            <v-app class="app-layout">
                <v-main>
                    <RouterView />
                    <app-dock /> 
                </v-main>
                <app-modal
                    {...appStore.state.modalProps}
                    model-value={appStore.state.modal}
                    onUpdate:modelValue={appStore.toggleModal}
                />
            </v-app>
            </div>
        )
    }
})
