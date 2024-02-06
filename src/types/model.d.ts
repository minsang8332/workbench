type DocumentType = 'markdown'
type ReceiptType = 'receipt'
interface IDocument {
    path: string
    isDir: boolean
    createdAt?: Date
    updatedAt?: Date
}
interface IReceipt extends StoreField {
    title: string
    desc: string | null
    price: number
    tax: number
    quantity: number
    isStock: boolean
}
