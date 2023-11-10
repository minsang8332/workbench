import Vue from 'vue'
export default {
    install() {
        Vue.prototype.$app = Vue.observable({
            // 좌측 사이드바
            drawer: false,
            // 모달 관련
            modal: false,
            modalProps: null,
            // 우측 마우스 클릭시 보이는 메뉴
            menu: false,
            menuEvent: null,
            // 파일명 변경 시 담을 변수
            updatePath: null,
        })
        const app = Vue.prototype.$app
        app.scss = (property) => {
            const style = getComputedStyle(document.body)
            return style.getPropertyValue(property)
        }
        app.showModal = (props) => {
            app.modal = true
            app.modalProps = props
        }
        app.showMenu = (props) => {
            app.menu = true
            app.menuProps = props
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
