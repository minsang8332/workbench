import Vue from 'vue'
import Toastify from 'toastify-js'
export default {
    install() {
        Vue.prototype.$toast = Vue.observable({})
        Vue.prototype.$toast.show = ({
            text = null,
            gravity = 'bottom',
            position = 'center',
            duration = 3000,
            newWindow = false,
            escapeMarkup = false,
            style = {
                background: Vue.prototype.$app.scss('--success-color'),
            },
            offset = {
                y: '5vh',
            },
            close = false,
        } = {}) => {
            const toastify = new Toastify({
                text,
                duration,
                close,
                gravity, // `top` or `bottom`
                position,
                stopOnFocus: true,
                newWindow,
                escapeMarkup,
                style,
                offset,
            })
            toastify.showToast()
            return toastify
        }
        Vue.prototype.$toast.success = ({
            text = '정상적으로 처리되었습니다.',
        } = {}) => {
            return Vue.prototype.$toast.show({
                text: `
                    <div class="app-toast">
                        <i class="fa-regular fa-circle-check"></i>
                        <p>${text}</p>
                    </div>
                `,
            })
        }
    },
}
