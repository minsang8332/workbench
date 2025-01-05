import _ from 'lodash'
import fs from 'fs-extra'
import crypto from 'crypto'
import mime from 'mime-types'
const getRandomHex = (bytes: number = 20): string => crypto.randomBytes(bytes).toString('hex')
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
const isVideoFile = (filePath: string) => {
    const mimeType = mime.lookup(filePath)
    if (_.isString(mimeType)) {
        return ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mkv', 'video/mov'].includes(mimeType)
    }
    return false
}
const isAvailablePath = async (filePath: string) => {
    return await new Promise((resolve, reject) =>
        fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (e) =>
            e ? reject(e) : resolve(true)
        )
    )
}
export default {
    encryptAES,
    decryptAES,
    getRandomHex,
    isVideoFile,
    isAvailablePath,
}
