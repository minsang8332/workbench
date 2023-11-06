type StoreType = MarkdownType
type Table = Markdown
interface StoreTable {
    [id: string]: Table
}
type MarkdownType = 'markdown'
interface Markdown {
    path: string
    isDir: boolean
}
