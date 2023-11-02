type StoreType = CategoryType | MarkdownType
type TableType = Category | Markdown
interface StoreTable {
    [id: string]: TableType
}
