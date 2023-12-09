import _ from 'lodash'
export default class AccountBook implements IAccountBook {
    id: string = ''
    title: string = ''
    desc: string | null = null
    price: number = 0
    tax: number = 0
    quantity: number = 0
    isStock: boolean = false
    createdAt: Date | null = null
    updatedAt: Date | null = null
    constructor(payload?: IAccountBook) {
        if (payload) {
            if (_.isNil(payload.createdAt)) {
                this.createdAt = new Date()
            }
            if (payload.updatedAt) {
                this.updatedAt = new Date()
            }
            this.setTitle(payload.title)
                .setDesc(payload.desc)
                .setPrice(payload.price)
                .setTax(payload.tax)
                .setQuantity(payload.quantity)
                .setIsStock(payload.isStock)
                .setCreatedAt(payload.createdAt)
                .setUpdatedAt(payload.createdAt)
        }
    }
    setTitle(title: string) {
        this.title = title
        return this
    }
    setDesc(desc: string | null = null) {
        this.desc = desc
        return this
    }
    setPrice(price: number = 0) {
        this.price = price
        return this
    }
    setQuantity(quantity: number = 0) {
        this.quantity = quantity
        return this
    }
    setTax(tax: number = 0) {
        this.tax = tax
        return this
    }
    setIsStock(isStock: boolean = false) {
        this.isStock = isStock
        return this
    }
    setCreatedAt(createdAt: Date | null = null) {
        this.createdAt = createdAt
        return this
    }
    setUpdatedAt(updatedAt: Date | null = null) {
        this.updatedAt = updatedAt
        return this
    }
}
