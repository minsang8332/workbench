interface AccountBook {
    title: string
    desc: string | null
    price: number
    tax: number
    service: number
    createdAt?: Date | null
    updatedAt?: Date | null
    deletedAt?: Date | null
}
type AccountBookType = 'account-book'
