import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface IAppState {
    drawer: boolean
    modal: boolean
    modalProps: IModalDialogProps
    menu: boolean
    menuProps: IContextMenuProps
}
const initModalProps = (): IModalDialogProps => {
    return {
        title: '',
        message: '',
        ok: null
    }
}
const initMenuProps = (): IContextMenuProps => {
    return {
        pageX: 0,
        pageY: 0,
        items: []
    }
}
// 어플리케이션 전반적인 동작 관련 전역 스토어
export const useAppStore = defineStore('app', () => {
    const state = reactive<IAppState>({
        drawer: false,
        // 모달 관련
        modal: false,
        modalProps: initModalProps(),
        // 컨텍스트 메뉴
        menu: false,
        menuProps: initMenuProps()
    })
    const getDrawer = computed(() => state.drawer)
    const scss = (property: string): string => {
        const style = getComputedStyle(document.body)
        return style.getPropertyValue(property)
    }
    const toggleDrawer = (drawer?: boolean) => {
        if (typeof drawer == 'boolean') {
            state.drawer = drawer
        } else {
            state.drawer = !state.drawer
        }
    }
    const toggleModal = (modal: boolean, modalProps?: IModalDialogProps) => {
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
    const toggleMenu = (menu: boolean, menuProps?: IContextMenuProps) => {
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
        getDrawer,
        toggleDrawer,
        toggleModal,
        toggleMenu,
        powerOff,
        waitUpdate,
        availableUpdate,
        installUpdate
    }
})
