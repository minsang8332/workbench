import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface ISettingStoreState {
    activePasscode: boolean
    emptyPasscode: boolean
    overlayVideoDirname: string
}
export const useSettingStore = defineStore('setting', () => {
    const state = reactive<ISettingStoreState>({
        activePasscode: false,
        emptyPasscode: false,
        overlayVideoDirname: ''
    })
    // Getters
    const getActivePasscode = computed(() => state.activePasscode)
    const getEmptyPasscode = computed(() => state.emptyPasscode)
    const getOverlayVideoDirname = computed(() => state.overlayVideoDirname)
    // Mutations
    const updateActivePasscode = (payload: ISettingStoreState['activePasscode'] = false) => {
        state.activePasscode = payload
    }
    const updateEmptyPasscode = (payload: ISettingStoreState['emptyPasscode'] = false) => {
        state.emptyPasscode = payload
    }
    const updateOverlayVideoDirname = (payload: string) => {
        state.overlayVideoDirname = payload
    }
    const loadPasscode = async () => {
        const response = await window.$native.setting.loadPasscode()
        updateEmptyPasscode(response.data.empty)
        updateActivePasscode(response.data.active)
        return response
    }
    // 패스워드 검증하기
    const verifyPasscode = async (text: string) => {
        return await window.$native.setting.verifyPasscode({ text })
    }
    // 패스코드 변경
    const changePasscode = async (text: string) => {
        return await window.$native.setting.updatePasscode({ text })
    }
    // 패스코드 활성화
    const activatePasscode = async (active: boolean) => {
        return await window.$native.setting.activatePasscode({ active })
    }
    // 오버레이 영상 목록
    const loadOverlayVideos = async (): Promise<IResponse> => {
        const response = await window.$native.setting.loadOverlayVideos()
        updateOverlayVideoDirname(response.data.dirname)
        return response
    }
    // 오버레이 영상 설정
    const updateOverlayVideo = async (): Promise<IResponse> => {
        return await window.$native.setting.updateOverlayVideo()
    }
    return {
        loadPasscode,
        getActivePasscode,
        getEmptyPasscode,
        getOverlayVideoDirname,
        verifyPasscode,
        changePasscode,
        activatePasscode,
        loadOverlayVideos,
        updateOverlayVideo
    }
})
