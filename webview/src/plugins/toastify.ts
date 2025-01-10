import _ from 'lodash'
import Toastify from 'toastify-js'
import type { App } from 'vue'
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
        const alert = (
            message = '',
            { icon = 'mdi mdi-emoticon-excited-outline', className = 'toastify--alert' } = {}
        ) => {
            if (_.isString(message) && message !== 'null') {
                show({
                    text: `
                    <div class="toasify__content">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                    className
                })
            }
        }
        const success = (
            message = '정상적으로 처리되었습니다.',
            { icon = 'mdi mdi-emoticon-excited-outline', className = 'toastify--success' } = {}
        ) => {
            if (_.isString(message) && message !== 'null') {
                show({
                    text: `
                    <div class="toasify__content">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                    className
                })
            }
        }
        const error = (
            { message = '작업을 처리할 수 없습니다.' }: Error,
            { icon = 'mdi mdi-emoticon-neutral-outline', className = 'toastify--danger' } = {}
        ) => {
            if (_.isString(message) && message !== 'null') {
                show({
                    text: `
                        <div class="toasify__content">
                            <i class="${icon}"></i>
                            <p>${message}</p>
                        </div>
                    `,
                    className
                })
            }
        }
        app.provide('toast', {
            show,
            alert,
            success,
            error
        })
    }
}
