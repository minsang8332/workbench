import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { app } from 'electron'
import commonTool from '@/tools/common'
const getMdDir = () =>
    path.resolve(app.getPath('documents'), app.getName(), 'markdown')
const ensureDir = (dir = '') => fs.ensureDirSync(dir, { mode: 0o2775 })
const readDirs = async (
    dir = '/',
    { onlyFile = false, onlyFolder = false } = {}
) => {
    let markdowns: Markdown[] = []
    try {
        const search = async (target = '/') => {
            const stats = fs.lstatSync(target)
            let isDir = false
            if (stats.isDirectory()) {
                isDir = true
                const files = fs.readdirSync(target)
                await Promise.all(
                    files.map((file) => search(path.join(target, file)))
                )
                if (onlyFile) {
                    return
                }
            } else {
                if (onlyFolder) {
                    return
                }
                if (path.extname(target) != '.md') {
                    return
                }
            }
            markdowns.push({
                path: target.replace(dir, '').replace(/\\/g, '/'),
                isDir,
            })
        }
        await search(dir)
        markdowns = markdowns.map((md) => {
            return md
        })
    } catch (e) {
        console.error(e)
    }
    return markdowns
}
const writeFile = (
    dir: string | null,
    {
        data,
        rootDir,
        filename,
        ext,
        overwrite = false,
    }: {
        data: string
        rootDir: string
        filename?: string
        ext?: string
        overwrite?: boolean
    }
) => {
    try {
        if (_.isNil(dir)) {
            dir = '/'
        }
        let dirname = path.join(rootDir, dir)
        if (fs.lstatSync(dirname).isFile()) {
            dirname = path.dirname(dirname)
        }
        if (!dirname) {
            throw `유효하지 않은 경로 입니다. (${dir})`
        }
        if (!_.isString(filename)) {
            filename = commonTool.randomHex()
        }
        if (filename && _.isString(ext)) {
            filename += ext
        }
        const target = path.join(dirname, filename)
        if (overwrite == false && fs.existsSync(target)) {
            throw `이미 존재하는 파일입니다. (${dir})`
        }
        fs.writeFileSync(target, data)
    } catch (e) {
        console.error(e)
    }
}
const removeFile = (
    dir: string | null,
    {
        rootDir,
    }: {
        rootDir: string
    }
) => {
    try {
        if (_.isNil(dir)) {
            dir = '/'
        }
        const target = path.join(rootDir, dir)
        fs.rmSync(target, { recursive: true, force: true })
    } catch (e) {
        console.error(e)
    }
}
export default {
    getMdDir,
    ensureDir,
    readDirs,
    writeFile,
    removeFile,
}
