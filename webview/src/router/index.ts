import { useAppStore } from '@/stores/app'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useRouterGuard } from '@/composables/useRouterGuard'
const routerGuard = useRouterGuard()
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/components/layout/PageLayout'),
            redirect: { name: 'diary' },
            children: [
                // 일지 작성
                {
                    name: 'diary',
                    path: 'diary',
                    components: {
                        default: () => import('@/views/diary/IndexPage'),
                        drawer: () => import('@/components/diary/DiaryDrawerMenu')
                    }
                },
                {
                    name: 'diary-detail',
                    path: 'diary/:path',
                    components: {
                        default: () => import('@/views/diary/DetailPage'),
                        drawer: () => import('@/components/diary/DiaryDrawerMenu')
                    },
                    props: true
                },
                // 해야 할 일
                {
                    name: 'todo',
                    path: 'todo',
                    component: () => import('@/views/todo/IndexPage')
                },
                // 환경 설정
                {
                    name: 'setting',
                    path: 'setting',
                    redirect: { name: 'setting-passcode' },
                    components: {
                        default: () => import('@/views/setting/IndexPage'),
                        drawer: () => import('@/components/setting/SettingDrawerMenu')
                    },
                    children: [
                        // 패스코드 설정하기
                        {
                            name: 'setting-passcode',
                            path: 'passcode',
                            component: () => import('@/views/setting/PasscodePage'),
                            meta: {
                                title: '패스코드 설정',
                                desc: '패스코드를 입력하여 앱의 보안을 강화하고 간편하게 활성화할 수 있는 기능을 제공합니다.'
                            }
                        }
                    ],
                    beforeEnter: [routerGuard.onBeforeEnterSetting]
                }
            ]
        },
        // not-found 핸들링
        {
            path: '/:pathMatch(.*)*',
            redirect: {
                name: 'diary'
            }
        }
    ]
})
export default router
