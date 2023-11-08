import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { app } from 'electron'
const getMdDir = () =>
    path.resolve(app.getPath('documents'), app.getName(), 'markdown')
const ensureDir = (dir = '') => fs.ensureDirSync(dir, { mode: 0o2775 })
const readDirsTree = async (
    rootDir: string,
    { onlyFile = false, onlyFolder = false } = {}
) => {
    const markdowns: Markdown[] = []
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
            path: transPathToKey(target, rootDir),
            isDir,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
        })
    }
    await search(rootDir)
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
    }: {
        data: string
        rootDir: string
        filename?: string
        ext?: string
        overwrite?: boolean
    }
) => {
    if (_.isNil(dir)) {
        dir = '/'
    }
    let tarDir = path.join(rootDir, dir)
    if (!isSubdir(rootDir, tarDir)) {
        throw { message: `유효하지 않은 경로 입니다. (${dir})` }
    }
    if (fs.lstatSync(tarDir).isDirectory()) {
        filename = `새 문서_${dayjs().format('YYYYMMDDHHmmss')}.${ext}`
        tarDir = path.join(tarDir, filename)
    }
    fs.writeFileSync(tarDir, data)
    return filename
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
    if (_.isNil(dir)) {
        dir = '/'
    }

    let target = path.join(rootDir, dir)
    if (!isSubdir(rootDir, target)) {
        throw { message: `${dirname} 디렉토리를 생성할 수 없습니다.` }
    }
    if (!_.isString(dirname)) {
        dirname = `새 폴더_${dayjs().format('YYYYMMDDHHmmss')}`
        target = path.join(rootDir, dir, dirname)
    }
    fs.ensureDir(target)
    return dirname
}
const remove = async (
    dir: string | null,
    {
        rootDir,
    }: {
        rootDir: string
    }
) => {
    if (_.isNil(dir)) {
        dir = '/'
    }
    const target = path.join(rootDir, dir)
    if (!isSubdir(rootDir, target)) {
        throw { message: '경로를 삭제할 수 없습니다.' }
    }
    await fs.rm(target, { recursive: true, force: true })
}
const rename = (
    target: string | null,
    {
        name,
        rootDir,
    }: {
        name: string
        rootDir: string
    }
): string => {
    if (_.isNil(target)) {
        target = '/'
    }
    target = path.join(rootDir, target)
    if (!isSubdir(rootDir, target)) {
        throw { message: '경로가 유효하지 않습니다' }
    }
    const { dir, ext } = path.parse(target)
    const rename = `${name}${ext ? ext : ''}`
    // 새로운 경로를 생성
    const newTarget = path.join(dir, rename)
    fs.renameSync(target, newTarget)
    return transPathToKey(newTarget, rootDir)
}
const transPathToKey = (target: string, rootDir: string) => {
    return target.replace(rootDir, '').replace(/\\/g, '/')
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
    readDirsTree,
    readFile,
    writeDir,
    writeFile,
    remove,
    rename,
}
