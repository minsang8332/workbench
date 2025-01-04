import path from 'path'
import fs from 'fs-extra'
import _ from 'lodash'
import crypto from 'crypto'
import mime from 'mime-types'
import { app } from 'electron'
const getRandomHex = (bytes: number = 20): string => crypto.randomBytes(bytes).toString('hex')
const getProgramDir = async () => {
    let dir = null
    if (process.platform == 'darwin') {
        dir = path.join(process.resourcesPath, 'data')
    } else if (process.platform == 'win32') {
        dir = path.dirname(app.getPath('exe'))
    }
    if (_.isNull(dir)) {
        return dir
    }
    // 폴더 권한 확인
    await new Promise((resolve, reject) =>
        fs.access(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (e) =>
            e ? reject(e) : resolve(true)
        )
    )
    return dir
}
const encryptAES = (text: string, secret: string, iv: string) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}
const decryptAES = (text: string, secret: string, iv: string) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
const isVideoFile = (filepath: string) => {
    const mimeType = mime.lookup(filepath)
    if (_.isString(mimeType)) {
        return ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mkv', 'video/mov'].includes(mimeType)
    }
    return false
}

export default {
    encryptAES,
    decryptAES,
    getRandomHex,
    getProgramDir,
    isVideoFile,
}
