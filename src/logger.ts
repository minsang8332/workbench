import path from 'path'
import dayjs from 'dayjs'
import _ from 'lodash'
import { app } from 'electron'
import logger from 'electron-log'
logger.transports.file.resolvePathFn = (variables, options) => {
    const level = options ? options.level : 'main'
    const today = dayjs().format('YYYYMMDD')
    const filePath = path.join(path.resolve(app.getPath('appData'), app.getName()), 'logs', `${level}-${today}.log`)
    return filePath
}
const { error } = logger
logger.error = (e: unknown) => {
    let payload = e
    if (e instanceof Error) {
        payload = {
            name: e.name,
            message: e.message,
            stack: e.stack,
        }
    } else if (_.isPlainObject(e)) {
        payload = JSON.stringify(e)
    } else {
        payload = _.toString(e)
    }
    error(payload)
}
export default logger
