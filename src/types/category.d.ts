type CategoryType = 'category'
interface Category {
    label: string
    filename?: string
    items: Category[]
}
