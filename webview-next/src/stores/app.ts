import { reactive } from 'vue'
import { defineStore } from 'pinia'
// 어플리케이션 전반적인 동작 관련 전역 스토어
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
    // 앱 종료
    const powerOff = () => {
        window.$native.exit()
    }
    // 업데이트 대기
    const waitUpdate = () => {
        return window.$native.updater.wait()
    }
    // 업데이트 가능 여부
    const availableUpdate = () => {
        return window.$native.updater.available()
    }
    // 업데이트 설치
    const installUpdate = () => {
        window.$native.updater.install()
    }
    return { state, scss, toggleDrawer, powerOff, waitUpdate, availableUpdate, installUpdate }
})
