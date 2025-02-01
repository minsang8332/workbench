declare module '*.module.scss'
export interface IToastifyPlugin {
    show: (Options) => Toastify
    alert: (message: string, options?: { icon: string; style: [CSSRule] }) => Toastify
    success: (message: string, options?: { icon: string; style: [CSSRule] }) => Toastify
    error: (message: Error, options?: { icon: string; style: [CSSRule] }) => Toastify
}
