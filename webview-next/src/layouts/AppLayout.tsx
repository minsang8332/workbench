import { RouterView } from 'vue-router'
import AppHeader from '@/layouts/AppHeader'
import AppDrawer from '@/layouts/AppDrawer'
export default () => (
    <v-app>
        <v-main>
            <AppHeader />
            <AppDrawer />
            <RouterView />
        </v-main>
    </v-app>
)
