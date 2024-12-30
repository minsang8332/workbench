import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/components/layout/PageLayout'),
            redirect: 'todo',
            children: [
                {
                    name: 'diary',
                    path: 'diary',
                    components: {
                        default: () => import('@/views/diary/IndexPage'),
                        drawer: () => import('@/components/diary/DiaryTree')
                    }
                },
                {
                    name: 'diary-detail',
                    path: 'diary/:path',
                    components: {
                        default: () => import('@/views/diary/DetailPage'),
                        drawer: () => import('@/components/diary/DiaryTree')
                    },
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
