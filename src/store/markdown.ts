import _ from 'lodash'
import Store from 'electron-store'
import commonUtil from '@/tools/common'
const store = new Store()
let storeGuard: boolean = false
const getMarkdown = (id: string) => {
    const markdown = store.get(id)
    if (!(markdown instanceof Markdown)) {
        return false
    }
    return markdown
}
const addMarkdown = (markdown: Markdown): Markdown | false => {
    // id 값이 있다면 수정하기
    if (markdown.id) {
        return editMarkdown(markdown.id)
    }
    markdown.id = <string>commonUtil.randomHex()
    const hasMd = store.get(markdown.id)
    // 생성한 문자가 동일하게 있다면 콜백
    if (hasMd) {
        // 재귀가 무한히 되지 않도록 함
        if (storeGuard === true) {
            return false
        }
        storeGuard = true
        return addMarkdown(markdown)
    }
    store.set(markdown.id, markdown)
    return markdown
}
const editMarkdown = (
    id: string,
    { filePath = null }: EditMarkdown = {}
): Markdown | false => {
    const markdown: Partial<Markdown> | unknown = store.get(id)
    if (!(markdown instanceof Markdown)) {
        return false
    }
    if (filePath) {
        markdown.filePath = filePath
    }
    store.set(markdown.id, markdown)
    return markdown
}
const delMarkdown = (id: string): Markdown | false => {
    const markdown: Partial<Markdown> | unknown = store.get(id)
    if (!(markdown instanceof Markdown)) {
        return false
    }
    store.delete(markdown.id)
    return markdown
}
export default {
    getMarkdown,
    addMarkdown,
    editMarkdown,
    delMarkdown,
}
