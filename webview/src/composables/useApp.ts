import _ from 'lodash'
import { useAppStore } from '@/stores/app'
export const useApp = () => {
    const appStore = useAppStore()
    const scss = (property: string) => {
        return getComputedStyle(document.body).getPropertyValue(property)
    }
    // 💡TODO calc 나 px 이 오는 경우 예외처리 필요
    const remToNumber = (strings = '') => {
        let width = null
        if (strings) {
            strings = _.first(_.split(strings, 'rem')) as string
            width =
                _.toNumber(strings) *
                parseFloat(getComputedStyle(document.documentElement).fontSize)
        }
        if (_.isNaN(width)) {
            width = null
        }
        return width
    }
    const getLayoutWidth = () => {
        const padding = scss('--page-layout-padding')
        // padding 은 좌우 양 옆이므로 2를 곱해야 한다
        return window.innerWidth - _.toNumber(remToNumber(padding)) * 2
    }
    const getDrawerWidth = () => {
        // 닫힌 경우 margin-right 4px 만큼 미는 값을 리턴
        if (appStore.getDrawer == false) {
            return -4
        }
        const width = scss('--drawer-menu-width')
        return _.toNumber(remToNumber(width))
    }
    return {
        scss,
        getLayoutWidth,
        getDrawerWidth
    }
}
