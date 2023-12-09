interface StoreField {
    [props]: string | number | boolean | Date | null
    id: string
    createdAt: Date | null
    updatedAt: Date | null
}
interface StoreTable<T extends StoreField> {
    [props: string]: T[]
}
