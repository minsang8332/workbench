import Vue from 'vue'
export default {
    install() {
        Vue.prototype.$modal = Vue.observable({
            value: false,
            show(value = true) {
                this.value = value
            },
        })
    },
}
