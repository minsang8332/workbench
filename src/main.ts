import { app } from 'electron'
import _ from 'lodash'
import '@/controllers'
import windowUtil from '@/utils/window'
import protocolUtil from '@/utils/protocol'
import { BROWSER_CRAWLER_COMMAND, BROWSER_CRWALER_STATUS } from '@/constants/window'
import { PROTOCOL } from '@/constants/app'
import { BrowserCrawler } from '@/utils/window'
import type { WindowUtil } from '@/types/window'
if (app.requestSingleInstanceLock() == false) {
    app.quit()
    process.exit(0)
}
app.on('will-finish-launching', () => {
    protocolUtil.registerMainWindow()
    protocolUtil.register(PROTOCOL.LOCAL, { stream: true })
})
app.on('ready', () => {
    protocolUtil.handleMainWindow()
    protocolUtil.handle(PROTOCOL.LOCAL)
    windowUtil.createMainWindow()
    /*
    const crawler = new BrowserCrawler()
    crawler.run({
        label: '웹 자동화 테스트',
        status: BROWSER_CRWALER_STATUS.WAITING,
        commands: [
            {
                type: BROWSER_CRAWLER_COMMAND.REDIRECT,
                url: 'https://medium.com/',
                timeout: 5000,
            } as WindowUtil.IRedirectCommand,
            {
                type: BROWSER_CRAWLER_COMMAND.CLICK,
                selector:
                    '#root > div > div.l.n.x > div.aw.ax.n.x.ay.az.ba > div.bb.av.m.bc.bd.be.bf.bg.bh > div > div > div > div.n.o.bs > div.bi > span > a > button',
                timeout: 8000,
            } as WindowUtil.IClickCommand,
        ],
    })
    */
})
app.on('window-all-closed', () => {
    app.quit()
})
app.on('second-instance', () => {
    let mainWindow = windowUtil.getMainWindow()
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore()
        }
        mainWindow.focus()
    }
})
