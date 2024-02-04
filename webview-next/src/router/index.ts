import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const router = createRouter({
    history:
        import.meta.env.NODE_ENV == 'production'
            ? createWebHashHistory(import.meta.env.BASE_URL)
            : createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/AppLayout'),
            redirect: 'dashboard',
            children: [
                {
                    name: 'dashboard',
                    path: '/dashboard',
                    component: () => import('@/views/DashboardPage')
                }
                /*
                {
                    name: 'markdown-editor',
                    path: '/markdown-editor/:path',
                    component: () => import('@/views/MdEditorPage.vue'),
                    props: true
                },
                {
                    name: 'account-book',
                    path: '/account-book',
                    component: () => import('@/views/AccountBookPage.vue')
                }
                */
            ]
        },
        // notfound-404 핸들링
        {
            path: '/:pathMatch(.*)*',
            redirect: 'dashboard'
        }
    ]
})
export default router
