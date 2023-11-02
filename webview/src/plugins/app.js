import Vue from 'vue'
export default {
    install() {
        Vue.prototype.$app = Vue.observable({
            drawer: false,
            modal: false,
            scss(property) {
                const style = getComputedStyle(document.body)
                return style.getPropertyValue(property)
            },
        })
    },
}
