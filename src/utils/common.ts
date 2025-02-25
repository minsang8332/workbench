import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import crypto from 'crypto'
import mime from 'mime-types'
import { app } from 'electron'
export const encryptAES = (text: string, secret: string, iv: string) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}
export const decryptAES = (text: string, secret: string, iv: string) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}
export const hideRootDir = (rootDir: string, destDir: string) => {
    return destDir.replace(rootDir, '').replace(/\\/g, '/')
}
export const getRandomHex = (bytes: number = 20): string => crypto.randomBytes(bytes).toString('hex')
export const getAppData = (subdir = '/') => {
    const dir = path.join(app.getPath('appData'), app.getName(), subdir)
    fs.ensureDirSync(dir, { mode: 0o2775 })
    return dir
}
export const isVideoFile = (filePath: string) => {
    const mimeType = mime.lookup(filePath)
    if (_.isString(mimeType)) {
        return ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mkv', 'video/mov'].includes(mimeType)
    }
    return false
}
export const isAvailablePath = async (filePath: string) => {
    return await new Promise((resolve, reject) =>
        fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, (e) =>
            e ? reject(e) : resolve(true)
        )
    )
}
export const isSubDir = async (parent: string, child: string) => {
    parent = path.resolve(parent)
    child = path.resolve(child)
    if (parent === child) {
        return true
    }
    if (path.relative(await fs.promises.realpath(parent), await fs.promises.realpath(child))) {
        return true
    }
    return false
}
export default {
    encryptAES,
    decryptAES,
    getRandomHex,
    getAppData,
    hideRootDir,
    isAvailablePath,
    isVideoFile,
    isSubDir,
}
