import Vue from 'vue'
export default {
    install() {
        Vue.prototype.$app = Vue.observable({
            drawer: false,
            modal: false,
            menu: false,
            bindMenu: null,
            updatePath: null,
        })
        const app = Vue.prototype.$app
        app.scss = (property) => {
            const style = getComputedStyle(document.body)
            return style.getPropertyValue(property)
        }
        app.showMenu = (bindMenu) => {
            app.menu = true
            app.bindMenu = bindMenu
        }
        app.setUpdatePath = (updatePath) => {
            app.updatePath = updatePath
            return app
        }
        app.getUpdatePath = () => {
            return app.updatePath
        }
    },
}
