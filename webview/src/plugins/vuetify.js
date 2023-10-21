import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-free/css/all.css'
Vue.use(Vuetify)
Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(fas)
export default new Vuetify({
    icons: {
        iconfont: 'fa' || 'faSvg',
    },
})
