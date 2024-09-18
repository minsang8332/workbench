import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/layouts/AppLayout'),
            redirect: 'todo',
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
                },
            ]
        },
        // not-found 핸들링
        {
            path: '/:pathMatch(.*)*',
            redirect: 'todo'
        }
    ]
})
export default router
