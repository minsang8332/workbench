export default {
    updateMarkdownStore(context, payload) {
        context.commit('updateMarkdown', payload)
    },
    async loadFiles(context) {
        const files = await window.$native.markdown.getFiles()
        context.dispatch('updateMarkdownStore', { files })
        return files
    },
}
