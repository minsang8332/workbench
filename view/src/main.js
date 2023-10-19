import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import AppLoading from '@/layouts/AppLoading'
import AppLayout from '@/layouts/AppLayout'
import store from './store'
import router from './router'
Vue.config.productionTip = false
const app = new Vue({
    vuetify,
    store,
    router,
    render: (h) => h(App)
})
Vue.component('app-loading', AppLoading)
Vue.component('app-layout', AppLayout)
app.$mount('#app')
