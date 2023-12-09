import _ from 'lodash'
export default {
    getAccountBooks(state) {
        return state.accountBooks
    },
    totalPrice(state, { getAccountBooks }) {
        return _.sum(getAccountBooks, (accountBook) => accountBook.price)
    },
    totalIncome(state, { getAccountBooks }) {
        return _.sum(getAccountBooks, (accountBook) => {
            if (accountBook.price > 0) {
                return 0
            }
            return accountBook.price
        })
    },
    totalExpanses(state, { getAccountBooks }) {
        return _.sum(getAccountBooks, (accountBook) => {
            if (accountBook.price < 0) {
                return 0
            }
            return accountBook.price
        })
    },
}
