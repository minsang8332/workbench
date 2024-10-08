import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
const scss = (property: string): string => {
    const style = getComputedStyle(document.body)
    return style.getPropertyValue(property)
}
const initModalProps = () => {
    return {
        title: '',
        message: '',
        ok: null
    }
}
const initMenuProps = () => {
    return {
        pageX: 0,
        pageY: 0,
        items: []
    }
}
// 어플리케이션 전반적인 동작 관련 전역 스토어
export const useAppStore = defineStore('app', () => {
    const state = reactive<IAppState>({
        // 모달 관련
        modal: false,
        modalProps: initModalProps(),
        // 메뉴
        menu: false,
        menuProps: initMenuProps()
    })
    const toggleModal = (modal: boolean, modalProps?: IAppModalProps) => {
        if (typeof modal == 'boolean') {
            state.modal = modal
            if (modal && modalProps) {
                state.modalProps = _.mergeWith(state.modalProps, modalProps, (a, b) =>
                    b == undefined ? a : b
                )
            } else {
                state.modalProps = initModalProps()
            }
        } else {
            state.modal = !state.modal
        }
    }
    const toggleMenu = (menu: boolean, menuProps?: IAppMenuProps) => {
        if (typeof menu == 'boolean') {
            state.menu = menu
            if (menu && menuProps) {
                state.menuProps = _.mergeWith(state.menuProps, menuProps, (a, b) =>
                    b == undefined ? a : b
                )
            } else {
                state.menuProps = initMenuProps()
            }
        } else {
            state.menu = !state.menu
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
        toggleModal,
        toggleMenu,
        powerOff,
        waitUpdate,
        availableUpdate,
        installUpdate
    }
})
