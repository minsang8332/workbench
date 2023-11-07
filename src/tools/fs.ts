import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { app } from 'electron'
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
const readFile = async (
    dir = '',
    {
        rootDir,
    }: {
        rootDir: string
    }
) => {
    const target = path.join(rootDir, dir)
    return fs.readFileSync(target, 'utf8')
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
        let tarDir = path.join(rootDir, dir)
        if (!isSubdir(rootDir, tarDir)) {
            throw `유효하지 않은 경로 입니다. (${dir})`
        }
        if (fs.lstatSync(tarDir).isDirectory()) {
            tarDir = path.join(
                tarDir,
                `새 문서_${dayjs().format('YYYYMMDDHHmmss')}${ext}`
            )
        }
        fs.writeFileSync(tarDir, data)
    } catch (e) {
        console.error(e)
    }
}
const writeDir = (
    dir: string | null,
    {
        dirname,
        rootDir,
    }: {
        dirname?: string
        rootDir: string
    }
) => {
    try {
        if (_.isNil(dir)) {
            dir = '/'
        }
        let target = path.join(rootDir, dir)
        if (_.isString(dirname)) {
            target = path.join(rootDir, dir, dirname)
        }
        if (!isSubdir(rootDir, target)) {
            throw `${dirname} 디렉토리를 생성할 수 없습니다.`
        }
        fs.ensureDir(target)
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
        fs.mkdirSync(target)
    } catch (e) {
        console.error(e)
    }
}
const isSubdir = async (parent: string, child: string) => {
    const rel = path.relative(
        await fs.promises.realpath(parent),
        await fs.promises.realpath(child)
    )
    return rel && !rel.includes('..')
}
export default {
    isSubdir,
    getMdDir,
    ensureDir,
    readDirs,
    readFile,
    writeDir,
    writeFile,
    removeFile,
}
