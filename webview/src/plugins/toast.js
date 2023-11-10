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
                background: Vue.prototype.$app.scss('--theme-color-g1'),
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
        Vue.prototype.$toast.alert = (
            message,
            {
                icon = '',
                style = {
                    background: Vue.prototype.$app.scss('--theme-color-g1'),
                },
            } = {}
        ) => {
            return Vue.prototype.$toast.show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                style,
            })
        }
        Vue.prototype.$toast.success = (
            message = '정상적으로 처리되었습니다.',
            {
                icon = 'fa-regular fa-face-laugh-squint',
                style = {
                    background: Vue.prototype.$app.scss('--success-color'),
                },
            } = {}
        ) => {
            return Vue.prototype.$toast.show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                style,
            })
        }
        Vue.prototype.$toast.error = (
            { message = '처리할 수 없습니다.' } = {},
            {
                icon = 'fa-regular fa-face-tired',
                style = {
                    background: Vue.prototype.$app.scss('--failed-color'),
                },
            } = {}
        ) => {
            return Vue.prototype.$toast.show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                style,
            })
        }
    },
}
