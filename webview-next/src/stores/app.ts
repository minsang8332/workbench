import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
// 어플리케이션 전반적인 동작 관련 전역 스토어
export const useAppStore = defineStore('app', () => {
    const state = reactive<IAppState>({
        // 좌측 사이드바
        drawer: false,
        // 모달 관련
        modal: false,
        modalProps: {
            message: null,
            ok: null
        },
        // 우측 마우스 클릭시 보이는 메뉴
        menu: false,
        // 파일명 변경 시 담을 변수
        inputPath: null
    })
    const getDrawer = computed(() => {
        return state.drawer
    })
    const scss = (property: string): string | null => {
        const style = getComputedStyle(document.body)
        if (!style) {
            return null
        }
        return style.getPropertyValue(property)
    }
    const showModal = (message: string, { ok }: { ok: () => any }) => {
        state.modalProps.message = message
        if (ok) {
            state.modalProps.ok = ok
        }
        toggleModal(true)
    }
    const toggleModal = (modal?: boolean) => {
        if (typeof modal == 'boolean') {
            state.modal = modal
            if (state.modal == false) {
                state.modalProps.message = null
                state.modalProps.ok = null
            }
        } else {
            state.modal = !state.modal
        }
    }
    const toggleDrawer = (drawer?: boolean) => {
        if (typeof drawer == 'boolean') {
            state.drawer = drawer
        } else {
            state.drawer = !state.drawer
        }
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
    return {
        state,
        scss,
        getDrawer,
        showModal,
        toggleModal,
        toggleDrawer,
        powerOff,
        waitUpdate,
        availableUpdate,
        installUpdate
    }
})
