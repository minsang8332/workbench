import _ from 'lodash'
import store from '@/store'
import commonUtil from '@/tools/common'
let guard: boolean = false
const getMarkdown = (id: string) => {
    const markdown = store.get('markdown', id)
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
    const hasOne = store.get('markdown', markdown.id)
    // 생성한 문자가 동일하게 있다면 콜백
    if (hasOne) {
        // 재귀가 무한히 되지 않도록 함
        if (guard === true) {
            return false
        }
        guard = true
        return addMarkdown(markdown)
    }
    store.set('markdown', markdown.id, markdown)
    return markdown
}
const editMarkdown = (
    id: string,
    {
        filename = null,
    }: {
        filename?: string | null
    } = {}
): Markdown | false => {
    const markdown: Partial<Markdown> | unknown = store.get('markdown', id)
    if (!(markdown instanceof Markdown)) {
        return false
    }
    if (filename) {
        markdown.filename = filename
    }
    store.set('markdown', markdown.id, markdown)
    return markdown
}
const unsetMarkdown = (id: string): Markdown | false => {
    const markdown: Partial<Markdown> | unknown = store.get('markdown', id)
    if (!(markdown instanceof Markdown)) {
        return false
    }
    store.unset('markdown', markdown.id)
    return markdown
}
export default {
    getMarkdown,
    addMarkdown,
    editMarkdown,
    unsetMarkdown,
}
