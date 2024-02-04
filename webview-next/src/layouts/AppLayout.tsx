import { RouterView } from 'vue-router'
import AppHeader from '@/layouts/AppHeader'
export default () => (
    <v-app>
        <v-main>
            <AppHeader />
            <RouterView />
        </v-main>
    </v-app>
)
