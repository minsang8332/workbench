import getters from './getters'
import mutations from './mutations'
import actions from './actions'
export default {
    namespaced: true,
    state: {
        // 파일 목록
        markdowns: [],
    },
    getters,
    mutations,
    actions,
}
