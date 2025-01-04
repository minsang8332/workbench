import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/app'
import markdown from '@/store/markdown'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        app,
        markdown,
    },
})
