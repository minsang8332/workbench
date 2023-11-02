import _ from 'lodash'
import { ipcMain } from 'electron'
import markdownStore from '@/store/markdown'
import fileTool from '@/tools/file'
ipcMain.handle('markdown:get', (event, id: string) => {
    const markdown = <Markdown>markdownStore.getMarkdown(id)
    if (!markdown) {
        throw { message: `${id} 에 해당하는 문서를 가져올 수 없습니다.` }
    }
    const text = fileTool.readFile(markdown.filename)
    return {
        ...markdown,
        text,
    }
})
ipcMain.handle(
    'markdown:set',
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
    const markdown = markdownStore.unsetMarkdown(id)
    if (!markdown) {
        throw { message: `${id} 에 해당하는 문서를 삭제 할 수 없습니다.` }
    }
    fileTool.removeFile(markdown.filename)
    return markdown
})
ipcMain.handle('markdown:files', (event) => {
    return fileTool.readFilenames()
})
