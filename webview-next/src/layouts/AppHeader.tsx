import { useAppStore } from '@/stores/app'
import '@/layouts/AppHeader.scoped.scss'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
    name: 'AppHeader',
    setup() {
        const appStore = useAppStore()
        const router = useRouter()
        const onPowerOff = () => {
            appStore.toggleModal(true, {
                message: '어플리케이션을 종료 하시겠습니까 ?',
                ok() {
                    appStore.powerOff()
                }
            })
        }
        return () => (
            <v-app-bar class="app-header native-drag" height="40" flat>
                <v-row no-gutters>
                    <v-col align-self="center">
                        <v-btn class="skip-native-drag" size="large" onClick={() => router.replace({ name: 'diary' })}>
                            <v-icon class="ico-folder text-white">fa-regular fa-file-lines</v-icon>
                            <v-tooltip activator="parent" location="top">
                                <p class="text-white">문서 편집</p>
                            </v-tooltip>
                        </v-btn>
                        <v-btn class="skip-native-drag" size="large" onClick={() => router.replace({ name: 'todo' })}>
                            <v-icon class="ico-folder text-white">fa-solid fa-list-check</v-icon>
                            <v-tooltip activator="parent" location="top">
                                <p class="text-white">해야 할 일</p>
                            </v-tooltip>
                        </v-btn>
                    </v-col>
                    <v-col align="right" align-self="center">
                        <v-btn class=" skip-native-drag" size="large" onClick={onPowerOff}>
                            <v-icon class="ico-power-off">fa-solid fa-power-off</v-icon>
                            <v-tooltip activator="parent" location="top">
                                <p class="text-white">종료하기</p>
                            </v-tooltip>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-app-bar>
        )
    }
})
