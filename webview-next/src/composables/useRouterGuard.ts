import _ from 'lodash'
import { type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useAppStore } from '@/stores/app'
export const useRouterGuard = () => {
    const onBeforeEnterSetting = (
        from: RouteLocationNormalized,
        to: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => {
        const appStore = useAppStore()
        appStore.toggleDrawer(true)
        next()
    }
    return {
        onBeforeEnterSetting
    }
}
