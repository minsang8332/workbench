import _ from 'lodash'
export default {
    updateCategory(state, { category } = {}) {
        _.mergeWith(
            state,
            {
                category,
            },
            (a, b) => (b == undefined ? a : b)
        )
    },
}
