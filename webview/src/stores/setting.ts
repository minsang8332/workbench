import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface ISettingState {
    activePasscode: boolean
    emptyPasscode: boolean
}
export const useSettingStore = defineStore('setting', () => {
    const state = reactive<ISettingState>({
        activePasscode: false,
        emptyPasscode: false
    })
    // Getters
    const getActivePasscode = computed(() => state.activePasscode)
    const getEmptyPasscode = computed(() => state.emptyPasscode)
    // Mutations
    const updateActivePasscode = (payload: ISettingState['activePasscode'] = false) => {
        state.activePasscode = payload
    }
    const updateEmptyPasscode = (payload: ISettingState['emptyPasscode'] = false) => {
        state.emptyPasscode = payload
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
        return await window.$native.setting.loadOverlayVideos()
    }
    // 오버레이 영상 설정
    const updateOverlayVideo = async (): Promise<IResponse> => {
        return await window.$native.setting.updateOverlayVideo()
    }
    return {
        loadPasscode,
        getActivePasscode,
        getEmptyPasscode,
        verifyPasscode,
        changePasscode,
        activatePasscode,
        loadOverlayVideos,
        updateOverlayVideo
    }
})
