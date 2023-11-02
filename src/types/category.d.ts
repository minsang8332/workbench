type CategoryType = 'category'
abstract class Category {
    label: string
    filename?: string
    items: Category[]
}
