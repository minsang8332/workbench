import Vue from 'vue'
import App from './App.vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'
import AppLoading from '@/lyouts/AppLoading'
import AppLayout from '@/layouts/AppLayout'
import store from './store'
Vue.config.productionTip = false
const app = new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App)
})
Vue.component('app-loading', AppLoading)
Vue.component('app-layout', AppLayout)
app.$mount('#app')
