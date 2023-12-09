import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/app'
import markdown from '@/store/markdown'
import accountBook from '@/store/account-book'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        app,
        markdown,
        'account-book': accountBook,
    },
})
