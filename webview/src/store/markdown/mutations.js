import _ from 'lodash'
export default {
    updateMarkdown(state, { markdowns } = {}) {
        _.mergeWith(
            state,
            {
                markdowns,
            },
            (a, b) => (b == undefined ? a : b)
        )
    },
}
