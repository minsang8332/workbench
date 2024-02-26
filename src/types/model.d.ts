type DiaryType = 'diary'
type ReceiptType = 'receipt'
type ReceiptStatusType = 'purchase' | 'sales' | 'stock'
interface IFile {
    path: string
    isDir: boolean
    createdAt: Date | null
    updatedAt: Date | null
}
interface IDiary extends IFile {}
interface IReceipt extends StoreField {
    title: string
    price: number
    quantity: number
    status: ReceiptStatusType | null
    desc: string | null
}
