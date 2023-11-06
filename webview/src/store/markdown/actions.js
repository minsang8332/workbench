export default {
    updateMarkdownStore(context, payload) {
        context.commit('updateMarkdown', payload)
    },
    async loadMarkdowns(context) {
        const markdowns = await window.$native.markdown.read()
        context.dispatch('updateMarkdownStore', { markdowns })
        return markdowns
    },
    async saveMarkdown(context, { path } = {}) {
        await window.$native.markdown.write({ path })
        context.dispatch('loadMarkdowns')
    },
    async removeMarkdown(context, { path } = {}) {
        await window.$native.markdown.remove({ path })
        context.dispatch('loadMarkdowns')
    },
}
