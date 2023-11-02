export default {
    getCategory(state) {
        return state.category
    },
    getCategoryByFile(state, getters, rootState, rootGetters = {}) {
        let category = {
            label: '전체',
            items: [],
        }
        try {
            const files = rootGetters['markdown/getFiles']
            if (!(files && files.length > 0)) {
                return category
            }
            category.items = files.map((file) => ({
                label: file,
                filename: file,
                items: [],
            }))
        } catch (e) {
            console.error(e)
        }
        return category
    },
}
