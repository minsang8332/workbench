import Vue from 'vue'
import Vuex from 'vuex'
import markdown from '@/store/markdown'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        markdown,
    },
})
