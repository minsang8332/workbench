import _ from 'lodash'
export default {
    updateAccountBook(state, { accountBooks } = {}) {
        _.mergeWith(
            state,
            {
                accountBooks,
            },
            (a, b) => (b == undefined ? a : b)
        )
    },
}
