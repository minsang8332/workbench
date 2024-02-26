import type { App } from 'vue'
import Toastify from 'toastify-js'
import { useAppStore } from '@/stores/app'
import 'toastify-js/src/toastify.css'
import '@/assets/css/toast.scss'
export default {
    install(app: App) {
        const appStore = useAppStore()
        const show = ({
            text = '',
            duration = 3000,
            newWindow = false,
            escapeMarkup = false,
            style = {
                background: String(appStore.scss('--theme-color-1'))
            },
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
                newWindow,
                escapeMarkup,
                style,
                offset
            })
            toastify.showToast()
            return toastify
        }
        const alert = (
            message = '',
            {
                icon = '',
                style = {
                    background: String(appStore.scss('--theme-color-1'))
                }
            }
        ) => {
            return show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                style
            })
        }
        const success = (
            message = '정상적으로 처리되었습니다.',
            {
                icon = 'fa-regular fa-face-laugh-squint',
                style = {
                    background: String(appStore.scss('--success-color'))
                }
            } = {}
        ) => {
            return show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                style
            })
        }
        const error = (
            { message = '작업을 처리할 수 없습니다.' }: Error,
            {
                icon = 'fa-regular fa-face-tired',
                style = {
                    background: String(appStore.scss('--failed-color'))
                }
            } = {}
        ) => {
            return show({
                text: `
                    <div class="app-toast">
                        <i class="${icon}"></i>
                        <p>${message}</p>
                    </div>
                `,
                style
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
