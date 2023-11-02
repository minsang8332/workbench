export default {
    updateCategoryStore(context, payload) {
        context.commit('updateCategory', payload)
    },

    async loadCategory(context) {
        const category = await window.$native.category.get()
        context.dispatch('updateCategoryStore', { category })
        context.dispatch('markdown/loadFiles', null, { root: true })
        return category
    },
}
