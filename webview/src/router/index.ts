import { useAppStore } from '@/stores/app'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useRouterGuard } from '@/composables/useRouterGuard'
const routerGuard = useRouterGuard()
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'authorized',
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
                        {
                            name: 'setting-passcode',
                            path: 'passcode',
                            component: () => import('@/views/setting/PasscodePage'),
                            meta: {
                                title: '패스코드 활성화',
                                desc: '앱의 보안을 강화하기 위한 패스코드를 활성화 합니다.'
                            }
                        },
                        {
                            name: 'setting-change-passcode',
                            path: 'change-passcode',
                            component: () => import('@/views/setting/ChangePasscodePage'),
                            meta: {
                                title: '패스코드 변경',
                                desc: '앱의 보안을 강화하기 위한 숫자로 구성된 4자리 패스코드를 설정 합니다.'
                            }
                        },
                        {
                            name: 'setting-layout',
                            path: 'layout',
                            component: () => import('@/views/setting/LayoutPage'),
                            meta: {
                                title: '레이아웃 설정',
                                desc: '앱의 레이아웃과 관련된 요소들을 설정합니다.'
                            }
                        }
                    ],
                    beforeEnter: [routerGuard.onBeforeEnterDrawerOpen]
                },
                // 웹 자동화
                {
                    name: 'worker',
                    path: 'worker/:id?',
                    components: {
                        default: () => import('@/views/crawler/WorkerPage'),
                        drawer: () => import('@/components/crawler/WorkerDrawerMenu')
                    },
                    props: true,
                    beforeEnter: [routerGuard.onBeforeEnterDrawerOpen]
                }
            ]
        },
        {
            path: '/',
            name: 'anonymous',
            component: () => import('@/components/layout/EmptyLayout'),
            children: [
                // 잠금 화면
                {
                    name: 'lock',
                    path: 'lock',
                    component: () => import('@/views/LockPage')
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
