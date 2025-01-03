import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface ISettingState {
    usePasscode: boolean
}
export const useTodoStore = defineStore('setting', () => {
    const state = reactive<ISettingState>({
        usePasscode: false
    })
    // Getters
    const getActivePasscode = computed(() => state.usePasscode)
    // Mutations
    const updateActivePasscode = (payload: ISettingState['usePasscode'] = false) => {
        state.usePasscode = payload
    }
    const loadPasscode = async () => {
        const response = await window.$native.setting.loadPasscode()
        updateActivePasscode(response.data.active)
    }
    // 패스워드 검증하기
    const verifyPasscode = async (text: string) => {
        const response = await window.$native.setting.verifyPasscode({ text })
        return response.data.result
    }
    // 패스코드 변경
    const changePasscode = async (text: string) => {
        const response = await window.$native.setting.updatePasscode({ text })
        return response.data.result
    }
    // 패스코드 활성화
    const activatePasscode = async (active: boolean) => {
        const response = await window.$native.setting.activatePasscode({ active })
        updateActivePasscode(response.data.active)
        return response.data.active
    }
    return {
        loadPasscode,
        getActivePasscode,
        verifyPasscode,
        changePasscode,
        activatePasscode
    }
})
