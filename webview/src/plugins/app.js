import Vue from 'vue'
export default {
    install() {
        Vue.prototype.$app = Vue.observable({
            drawer: false,
            modal: false,
            menu: false,
            bindMenu: null,
            scss(property) {
                const style = getComputedStyle(document.body)
                return style.getPropertyValue(property)
            },
            showMenu(bindMenu = null) {
                this.menu = true
                this.bindMenu = bindMenu
            },
            hideMenu() {
                this.menu = false
                this.bindMenu = null
            },
        })
    },
}
