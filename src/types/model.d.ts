type DiaryType = 'diary'
type ReceiptType = 'receipt'
interface IFile {
    path: string
    isDir: boolean
    createdAt?: Date
    updatedAt?: Date
}
interface IDiary extends IFile {}
interface IReceipt extends StoreField {
    title: string
    desc: string | null
    price: number
    tax: number
    quantity: number
    isStock: boolean
}
