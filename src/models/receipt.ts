import _ from 'lodash'
export default class Receipt implements IReceipt {
    id: string = ''
    title: string = ''
    desc: string | null = null
    price: number = 0
    tax: number = 0
    quantity: number = 0
    status: ReceiptStatusType | null = null
    createdAt: Date | null = null
    updatedAt: Date | null = null

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
    setStatus(status: ReceiptStatusType | null = null) {
        this.status = status
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
