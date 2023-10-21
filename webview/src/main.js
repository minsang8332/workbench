import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import AppLoading from '@/layouts/AppLoading'
import AppLayout from '@/layouts/AppLayout'
import AppModal from '@/layouts/AppModal'
import store from './store'
import router from './router'
import appPlugin from '@/plugins/app'
import './assets/css/app.scss'
Vue.config.productionTip = false
const app = new Vue({
    vuetify,
    store,
    router,
    render: (h) => h(App),
})
Vue.component('app-loading', AppLoading)
Vue.component('app-layout', AppLayout)
Vue.component('app-modal', AppModal)
Vue.use(appPlugin)
app.$mount('#app')
