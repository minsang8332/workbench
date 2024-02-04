import styles from './AppDrawer.module.scss'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
export default () => (
    <v-navigation-drawer v-model={appStore.state.drawer} class={styles.appDrawer}>
        <v-card class="card-app-drawer" tile flat>
            <v-row class="row-category" no-gutters>
                <v-col></v-col>
            </v-row>
            <v-row class="row-footer" no-gutters>
                <v-col>
                    <v-divider />
                </v-col>
            </v-row>
        </v-card>
    </v-navigation-drawer>
)
