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
                    name: 'diary',
                    path: '/diary',
                    component: () => import('@/views/DiaryPage'),
                },
                {
                    name: 'diary-editor',
                    path: '/diary/:path',
                    component: () => import('@/views/DiaryEditorPage'),
                    props: true
                },
                {
                    name: 'todo',
                    path: '/todo',
                    component: () => import('@/views/TodoPage'),
                }
            ]
        },
        // not-found 핸들링
        {
            path: '/:pathMatch(.*)*',
            redirect: 'diary'
        }
    ]
})
export default router
