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
                    path: 'diary',
                    component: () => import('@/views/diary/IndexPage')
                },
                {
                    name: 'diary-detail',
                    path: 'diary/:path',
                    component: () => import('@/views/diary/DetailPage'),
                    props: true
                },
                {
                    name: 'todo',
                    path: 'todo',
                    component: () => import('@/views/todo/IndexPage')
                }
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
