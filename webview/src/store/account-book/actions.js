export default {
    updateAccountBookStore(context, payload) {
        context.commit('updateAccountBook', payload)
    },
    async loadAccountBooks(context) {
        const response = await window.$native.accountBook.readAll()
        const { accountBooks } = response.data
        context.dispatch('updateAccountBook', { accountBooks })
        return {
            accountBooks,
        }
    },
    saveAccountBook() {},
    removeAccountBook() {},
}
