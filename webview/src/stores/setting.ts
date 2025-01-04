import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface ISettingState {
    activePasscode: boolean
}
export const useSettingStore = defineStore('setting', () => {
    const state = reactive<ISettingState>({
        activePasscode: false
    })
    // Getters
    const getActivePasscode = computed(() => state.activePasscode)
    // Mutations
    const updateActivePasscode = (payload: ISettingState['activePasscode'] = false) => {
        state.activePasscode = payload
    }
    const loadPasscode = async () => {
        const response = await window.$native.setting.loadPasscode()
        updateActivePasscode(response.data.active)
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
    return {
        loadPasscode,
        getActivePasscode,
        verifyPasscode,
        changePasscode,
        activatePasscode
    }
})
