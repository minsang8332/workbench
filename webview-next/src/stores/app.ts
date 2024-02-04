import { reactive } from 'vue'
import { defineStore } from 'pinia'
export const useAppStore = defineStore('app', () => {
    const state = reactive({
        // 좌측 사이드바
        drawer: false,
        // 모달 관련
        modal: false,
        // 우측 마우스 클릭시 보이는 메뉴
        menu: false,
        // 파일명 변경 시 담을 변수
        updatePath: null
    })
    const scss = (property: string): string | null => {
        const style = getComputedStyle(document.body)
        if (!style) {
            return null
        }
        return style.getPropertyValue(property)
    }
    const toggleDrawer = () => {
        state.drawer = !state.drawer
    }
    return { state, scss, toggleDrawer }
})
