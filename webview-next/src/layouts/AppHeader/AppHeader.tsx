import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const onOpenDir = () => {}
const onPowerOff = () => {}
import styles from '@/layouts/AppHeader/AppHeader.module.scss'
export default () => (
    <v-app-bar flat class={styles.appHeader} height={appStore.scss('--app-header-height')}>
        <v-row no-gutters>
            <v-col>
                <v-btn class="skip-native-drag" onClick={appStore.toggleDrawer}>
                    <v-icon>fa-solid fa-bars</v-icon>
                </v-btn>
                <v-btn class="skip-native-drag" onClick={onOpenDir}>
                    <v-icon>fa-solid fa-folder</v-icon>
                </v-btn>
            </v-col>
            <v-col align="right">
                <v-btn class="skip-native-drag" onClick={onPowerOff}>
                    <v-icon>fa-solid fa-power-off</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-app-bar>
)
