import { app } from 'electron'
import _ from 'lodash'
import '@/controllers'
import windowUtil from '@/utils/window'
import protocolUtil from '@/utils/protocol'
import { PROTOCOL } from '@/constants/app'
import logger from './logger'
/*
import { CRAWLER_COMMAND, CRWALER_STATUS } from '@/constants/model'
import CrawlerService from '@/services/CrawlerService'
*/
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
    const crawlerService = new CrawlerService()
    crawlerService.run({
        label: '웹 자동화 테스트',
        status: BROWSER_CRWALER_STATUS.WAITING,
        commands: [
            {
                type: CRAWLER_COMMAND.REDIRECT,
                url: 'https://www.naver.com/',
                timeout: 5000,
            } as WindowUtil.IRedirectCommand,
            {
                type: CRAWLER_COMMAND.CLICK,
                selector: '#sform > fieldset > button',
                timeout: 5000,
            } as WindowUtil.IClickCommand,
            {
                type: CRAWLER_COMMAND.CURSOR,
            },
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
