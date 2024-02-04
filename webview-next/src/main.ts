import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetifyPlugin from '@/plugins/vuetify'
// Vue
import App from '@/App'
import router from '@/router'
// Build App
import '@/assets/css/app.scss'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetifyPlugin)
app.mount('#app')
