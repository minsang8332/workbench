interface IAccountBook extends StoreField {
    title: string
    desc: string | null
    price: number
    tax: number
    quantity: number
    isStock: boolean
}
interface IAccountBookForm extends IAccountBook {
    id?: string
    title: string
    desc?: string
    price?: number
    quantity?: number
    tax?: number
    isStock?: boolean
}
type AccountBookType = 'account-book'
