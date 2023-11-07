import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        component: () => import('@/layouts/AppLayout.vue'),
        children: [
            {
                name: 'dashboard',
                path: '/',
                component: () => import('@/views/DashboardPage.vue'),
            },
            {
                name: 'markdown',
                path: '/markdown/:path',
                component: () => import('@/views/MarkdownPage.vue'),
                props: true,
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
