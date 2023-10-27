import _ from 'lodash'
import { ipcMain } from 'electron'
import markdownStore from '@/store/markdown'
import documentsUtil from '@/tools/documents'
ipcMain.handle('markdown:findAll', (event) => {
    return documentsUtil.readFilenames()
})
ipcMain.handle('markdown:findOne', (event, id: string) => {
    const markdown = markdownStore.getMarkdown(id)
    if (!markdown) {
        throw { message: `${id} 에 해당하는 문서를 가져올 수 없습니다.` }
    }
    const text = documentsUtil.readFile(markdown.filePath)
    return {
        ...markdown,
        text,
    }
})
ipcMain.handle(
    'markdown:edit',
    (event, { id, md }: { id?: string; md: Markdown }) => {
        if (!_.isString(id)) {
            throw { message: 'id 값이 유효하지 않습니다.' }
        }
        const edited = markdownStore.editMarkdown(id, md)
        if (!edited) {
            throw { message: `${id} 에 해당하는 문서를 편집 할 수 없습니다.` }
        }
        return edited
    }
)
ipcMain.handle('markdown:delete', (event, id: string) => {
    if (!_.isString(id)) {
        throw { message: 'id 값이 유효하지 않습니다.' }
    }
    const markdown = markdownStore.delMarkdown(id)
    if (!markdown) {
        throw { message: `${id} 에 해당하는 문서를 삭제 할 수 없습니다.` }
    }
    documentsUtil.removeFile(markdown.filePath)
    return markdown
})
