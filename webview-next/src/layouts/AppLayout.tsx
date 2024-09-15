import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/layouts/AppHeader'
import AppModal from '@/layouts/AppModal'
import DiaryDrawer from '@/components/diary/DiaryDrawer'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'AppLayout',
    components: {
        AppHeader,
        AppModal,
        DiaryDrawer,
    },
    setup() {
        const appStore = useAppStore()
        return () => (
            <v-app>
                <app-header />
                <diary-drawer />
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
