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
                    redirect: { name: 'active-passcode' },
                    components: {
                        default: () => import('@/views/setting/IndexPage'),
                        drawer: () => import('@/components/setting/SettingDrawerMenu')
                    },
                    children: [
                        // 패스코드 설정하기
                        {
                            name: 'active-passcode',
                            path: 'passcode',
                            component: () => import('@/views/setting/ActivePasscodePage'),
                            meta: {
                                title: '패스코드 설정',
                                desc: '앱의 보안을 강화하기 위한 패스코드를 활성화 합니다.'
                            }
                        },
                        {
                            name: 'change-passcode',
                            path: 'passcode',
                            component: () => import('@/views/setting/ChangePasscodePage'),
                            meta: {
                                title: '패스코드 설정',
                                desc: '앱의 보안을 강화하기 위한 숫자로 구성된 4자리 패스코드를 설정 합니다.'
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
