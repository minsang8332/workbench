import Vue from 'vue'
import VueRouter from 'vue-router/dist/vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        component: () => import('@/layouts/AppLayout.vue'),
        redirect: 'dashboard',
        children: [
            {
                name: 'dashboard',
                path: '/dashboard',
                component: () => import('@/views/DashboardPage.vue'),
            },
            {
                name: 'markdown-editor',
                path: '/markdown-editor/:path',
                component: () => import('@/views/MdEditorPage.vue'),
                props: true,
            },
        ],
    },
    // notfound-404 핸들링
    {
        path: '*',
        redirect: 'dashboard',
    },
]
const router = new VueRouter({
    mode: process.env.NODE_ENV == 'production' ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes,
})
export default router
