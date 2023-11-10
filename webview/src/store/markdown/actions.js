export default {
    updateMarkdownStore(context, payload) {
        context.commit('updateMarkdown', payload)
    },
    // 문서 목록 가져오기
    async loadMarkdowns(context) {
        const response = await window.$native.markdown.readAll()
        const { markdowns } = response.data
        context.dispatch('updateMarkdownStore', { markdowns })
        return {
            markdowns,
        }
    },
    // 문서 열기
    async loadMarkdown(context, { target } = {}) {
        const response = await window.$native.markdown.read({ target })
        const { text } = response.data
        return {
            text,
        }
    },
    // 문서 저장
    async saveMarkdown(context, { target, text } = {}) {
        const response = await window.$native.markdown.write({ target, text })
        context.dispatch('loadMarkdowns')
        const { writed } = response.data
        return {
            writed,
        }
    },
    // 문서 이름 변경
    async renameMarkdown(context, { target, rename } = {}) {
        const response = await window.$native.markdown.rename({
            target,
            rename,
        })
        context.dispatch('loadMarkdowns')
        const { renamed } = response.data
        return {
            renamed,
        }
    },
    // 문서 폴더 생성
    async saveMarkdownDir(context, { target } = {}) {
        const response = await window.$native.markdown.writeDir({ target })
        context.dispatch('loadMarkdowns')
        const { writed } = response.data
        return {
            writed,
        }
    },
    // 문서 폴더 열기
    openMarkdownDir() {
        window.$native.markdown.openDir()
    },
    // 문서 삭제
    async removeMarkdown(context, { target } = {}) {
        const response = await window.$native.markdown.remove({ target })
        context.dispatch('loadMarkdowns')
        const { removed } = response.data
        return {
            removed,
        }
    },
    // 문서 이동
    async moveMarkdown(context, { target, dest } = {}) {
        const response = await window.$native.markdown.move({ target, dest })
        context.dispatch('loadMarkdowns')
        const { moved } = response.data
        return {
            moved,
        }
    },
}
