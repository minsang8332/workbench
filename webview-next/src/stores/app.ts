import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
const scss = (property: string): string => {
    const style = getComputedStyle(document.body)
    return style.getPropertyValue(property)
}
const resetModalProps = () => {
    return {
        message: null,
        ok: null
    }
}
// 어플리케이션 전반적인 동작 관련 전역 스토어
export const useAppStore = defineStore('app', () => {
    const state = reactive<IAppState>({
        // 모달 관련
        modal: false,
        modalProps: resetModalProps(),
    })
    const toggleModal = (modal: boolean, modalProps?: IAppModalProps) => {
        if (typeof modal == 'boolean') {
            state.modal = modal
            if (modal && modalProps) {
                state.modalProps = _.mergeWith(state.modalProps, modalProps, (a, b) =>
                    b == undefined ? a : b
                )
            } else {
                state.modalProps = resetModalProps()
            }
        } else {
            state.modal = !state.modal
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
        powerOff,
        waitUpdate,
        availableUpdate,
        installUpdate
    }
})
