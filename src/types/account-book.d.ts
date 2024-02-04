interface IAccountBook extends StoreField {
    title: string
    desc: string | null
    price: number
    tax: number
    quantity: number
    isStock: boolean
}
namespace IpcPayload {
    namespace AccountBook {
        interface IRead {
            id: string
        }
        interface ISave extends IAccountBook {
            id?: string
            title: string
            desc?: string
            price?: number
            quantity?: number
            tax?: number
            isStock?: boolean
        }
        interface IRemove {
            id: string
        }
    }
}
type AccountBookType = 'account-book'
