import type { App } from 'vue'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
export default {
    install(app: App) {
        const show = ({
            text = '',
            duration = 3000,
            newWindow = false,
            escapeMarkup = false,
            className,
            offset = {
                y: '10vh',
                x: ''
            },
            close = false
        }: Toastify.Options = {}) => {
            const toastify = Toastify({
                text,
                duration,
                close,
                gravity: 'bottom',
                position: 'right',
                stopOnFocus: true,
                className,
                newWindow,
                escapeMarkup,
                offset,
                onClick() {
                    toastify.hideToast()
                }
            })
            toastify.showToast()
            return toastify
        }
        const alert = (message = '', { icon = '' }) => {
            return show({
                text: `
                    <div class="toasify__content">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `
            })
        }
        const success = (
            message = '정상적으로 처리되었습니다.',
            { icon = 'mdi mdi-emoticon-excited-outline', className = 'toastify--success' } = {}
        ) => {
            return show({
                text: `
                    <div class="toasify__content">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                className
            })
        }
        const error = (
            { message = '작업을 처리할 수 없습니다.' }: Error,
            { icon = 'mdi mdi-emoticon-neutral-outline', className = 'toastify--danger' } = {}
        ) => {
            return show({
                text: `
                    <div class="toasify__content">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                className
            })
        }
        app.provide('toast', {
            show,
            alert,
            success,
            error
        })
    }
}
