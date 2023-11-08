import Vue from 'vue'
import Toastify from 'toastify-js'
import '@/assets/css/toast.scss'
export default {
    install() {
        Vue.prototype.$toast = Vue.observable({})
        Vue.prototype.$toast.show = ({
            text = null,
            gravity = 'bottom',
            position = 'right',
            duration = 3000,
            newWindow = false,
            escapeMarkup = false,
            style = {
                background: Vue.prototype.$app.scss('--success-color'),
            },
            offset = {
                y: '12vh',
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
            icon = 'fa-regular fa-face-laugh-squint',
        } = {}) => {
            return Vue.prototype.$toast.show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${text}</p>
                    </div>
                `,
            })
        }
    },
}
