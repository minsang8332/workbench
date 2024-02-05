import { useAppStore } from '@/stores/app'
import '@/layouts/AppDrawer.scoped.scss'
const appStore = useAppStore()
export default () => (
    <v-navigation-drawer
        class="app-drawer"
        v-model={appStore.state.drawer}
        clipped
        mobile-breakpoint="0"
    >
        <v-card class="card-app-drawer" tile flat>
            <v-row class="row-category" no-gutters>
                <v-col></v-col>
            </v-row>
        </v-card>
    </v-navigation-drawer>
)
