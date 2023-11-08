export default {
    updateMarkdownStore(context, payload) {
        context.commit('updateMarkdown', payload)
    },
    // 문서 목록 가져오기
    async loadMarkdowns(context) {
        const markdowns = await window.$native.markdown.readAll()
        context.dispatch('updateMarkdownStore', { markdowns })
        return markdowns
    },
    // 문서 열기
    async loadMarkdown(context, { path } = {}) {
        const { data } = await window.$native.markdown.read({ path })
        return {
            data,
        }
    },
    // 문서 저장
    async saveMarkdown(context, { path, data } = {}) {
        const { writed } = await window.$native.markdown.write({ path, data })
        context.dispatch('loadMarkdowns')
        return {
            writed,
        }
    },
    // 문서 이름 변경
    async renameMarkdown(context, { path, name } = {}) {
        const { renamed } = await window.$native.markdown.rename({ path, name })
        context.dispatch('loadMarkdowns')
        return {
            renamed,
        }
    },
    // 문서 폴더 생성
    async saveMarkdownDir(context, { path } = {}) {
        const { writed } = await window.$native.markdown.writeDir({ path })
        context.dispatch('loadMarkdowns')
        return {
            writed,
        }
    },
    // 문서 폴더 열기
    openMarkdownDir() {
        window.$native.markdown.openDir()
    },
    // 문서 삭제
    async removeMarkdown(context, { path } = {}) {
        await window.$native.markdown.remove({ path })
        context.dispatch('loadMarkdowns')
    },
}
