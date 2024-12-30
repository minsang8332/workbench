import { createApp } from 'vue'
import { createPinia } from 'pinia'
import toastPlugin from '@/plugins/toast'
import router from '@/router'
import App from '@/App'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/css/main.scss'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(toastPlugin)
app.mount('#app')
