import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        component: () => import('@/layouts/AppLayout.vue'),
        children: [
            {
                name: 'DashBoard',
                path: '/',
                component: () => import('@/views/DashBoard.vue'),
            },
        ],
    },
]
const router = new VueRouter({
    mode: process.env.NODE_ENV == 'production' ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes,
})
export default router
