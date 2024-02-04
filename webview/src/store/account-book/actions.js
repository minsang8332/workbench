export default {
    updateAccountBookStore(context, payload) {
        context.commit('updateAccountBook', payload)
    },
    async loadAccountBooks(context, payload) {
        const response = await window.$native.accountBook.read(payload)
        const { accountBooks } = response.data
        context.dispatch('updateAccountBook', { accountBooks })
        return {
            accountBooks,
        }
    },
    saveAccountBook() {},
    removeAccountBook() {},
}
