import path from 'path'
import url from 'url'
import _ from 'lodash'
import { protocol, net } from 'electron'
import { PROTOCOL } from '@/constants/app'
export const register = (
    scheme: string,
    {
        secure = true,
        standard = true,
        supportFetchAPI = true,
        stream = false,
    }: {
        secure?: boolean
        standard?: boolean
        supportFetchAPI?: boolean
        stream?: boolean
    } = {}
) => {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: scheme,
            privileges: {
                secure,
                standard,
                supportFetchAPI,
                stream,
            },
        },
    ])
}
export const registerMainWindow = () => {
    register(PROTOCOL.MAIN_WINDOW)
}
export const handleMainWindow = () => {
    protocol.handle(PROTOCOL.MAIN_WINDOW, async (request) => {
        let filepath = new URL(request.url).pathname
        filepath = path.resolve(path.join(__dirname, 'dist', filepath))
        filepath = url.pathToFileURL(filepath).toString()
        return net.fetch(filepath)
    })
}
export const handle = (scheme: PROTOCOL) => {
    protocol.handle(scheme, async (request) => {
        let filepath = new URL(request.url).pathname
        // 한글이 있는 경우 디코딩 해주고 다시 파일 프로토콜로 만든다.
        filepath = decodeURIComponent(filepath)
        filepath = url.pathToFileURL(filepath).toString()
        return net.fetch(filepath)
    })
}
export default {
    register,
    registerMainWindow,
    handle,
    handleMainWindow,
}
