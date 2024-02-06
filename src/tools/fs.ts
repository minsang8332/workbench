import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { app } from 'electron'
export const getDocsDir = () =>
    path.resolve(app.getPath('documents'), app.getName())
const ensureDir = (dir = '') => fs.ensureDirSync(dir, { mode: 0o2775 })
const sliceRootDir = (rootDir: string, tarDir: string) => {
    return tarDir.replace(rootDir, '').replace(/\\/g, '/')
}
const isSubdir = async (parent: string, child: string) => {
    parent = path.resolve(parent)
    child = path.resolve(child)
    if (parent === child) {
        return true
    }
    const rel = path.relative(
        await fs.promises.realpath(parent),
        await fs.promises.realpath(child)
    )
    // 이 모듈을 rest-api 에서도 쓸 예정이므로 절대 상대 패스를 절대 허용하지 않음
    return rel && !rel.includes('..')
}
const readTreeDirs = async (
    rootDir: string,
    { onlyFile = false, onlyFolder = false } = {}
) => {
    const docs: IDocument[] = []
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
        docs.push({
            path: sliceRootDir(rootDir, target),
            isDir,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
        })
    }
    await search(rootDir)
    return docs
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
const writeFile = async (
    target: string,
    {
        filename,
        text,
        ext,
        rootDir,
    }: {
        filename?: string
        text: string
        ext: string
        rootDir: string
    }
) => {
    if (!_.isString(target)) {
        target = '/'
    }
    if (!_.isString(filename)) {
        filename = `새 문서_${dayjs().format('YYYYMMDDHHmmss')}.${ext}`
    }
    let tarDir = path.join(rootDir, target)
    if (!(await isSubdir(rootDir, tarDir))) {
        throw new Error('유효하지 않은 경로 입니다.')
    }
    if (fs.lstatSync(tarDir).isDirectory()) {
        tarDir = path.join(tarDir, filename)
    }
    fs.writeFileSync(tarDir, text)
    return filename
}
const writeDir = async (
    target: string,
    {
        dirname,
        rootDir,
    }: {
        dirname?: string
        rootDir: string
    }
) => {
    if (!_.isString(target)) {
        target = '/'
    }
    let tarDir = path.join(rootDir, target)
    // 루트 경로가 아니면서 하위 경로가 아니라면
    if (!(await isSubdir(rootDir, tarDir))) {
        throw new Error('유효하지 않은 경로 입니다.')
    }
    // 폴더명이 지정되지 않았다면
    if (!_.isString(dirname)) {
        dirname = `새 폴더_${dayjs().format('YYYYMMDDHHmmss')}`
        tarDir = path.join(tarDir, dirname)
    }
    fs.ensureDir(tarDir)
    return dirname
}
const remove = async (
    target: string | null,
    {
        rootDir,
    }: {
        rootDir: string
    }
) => {
    if (!_.isString(target)) {
        target = '/'
    }
    const tarDir = path.join(rootDir, target)
    if (!(await isSubdir(rootDir, tarDir))) {
        throw new Error('대상을 제거 할 수 없습니다.')
    }
    await fs.rm(tarDir, { recursive: true, force: true })
    const { base } = path.parse(tarDir)
    return base
}
const rename = async (
    target: string,
    rename: string,
    {
        rootDir,
    }: {
        rootDir: string
    }
) => {
    if (!_.isString(target)) {
        target = '/'
    }
    const tarDir = path.join(rootDir, target)
    if (!(await isSubdir(rootDir, tarDir))) {
        throw new Error('유효하지 않은 경로 입니다.')
    }
    const { dir, ext } = path.parse(tarDir)
    rename = `${rename}${ext ? ext : ''}`
    // 새로운 경로를 생성
    const renameDir = path.join(dir, rename)
    if (fs.existsSync(renameDir)) {
        throw new Error('이미 존재하는 파일명 입니다.')
    }
    fs.renameSync(tarDir, renameDir)
    return sliceRootDir(rootDir, renameDir)
}
const move = async (
    target: string,
    dest: string,
    {
        rootDir,
    }: {
        rootDir: string
    }
) => {
    if (!_.isString(target)) {
        target = '/'
    }
    if (!_.isString(dest)) {
        dest = '/'
    }
    const tarDir = path.join(rootDir, target)
    let destDir = path.join(rootDir, dest)
    // 목적지가 대상의 하위 상위 경로인 경우
    if (await isSubdir(tarDir, destDir)) {
        throw new Error('하위 경로로 이동할 수 없습니다.')
    }
    const tarParsed = path.parse(tarDir)
    const destParsed = path.parse(destDir)
    if (tarParsed.base == destParsed.base) {
        throw new Error(
            '대상과 이동할 곳의 이름이 일치하여 덮어 쓸 수 없습니다.'
        )
    }
    // 목적지가 파일인 경우
    if (fs.lstatSync(destDir).isFile()) {
        destDir = path.join(destParsed.dir, tarParsed.base)
    } else {
        destDir = path.join(destDir, tarParsed.base)
    }
    if (tarDir == destDir) {
        throw new Error('목적지가 현재 경로 입니다.')
    }
    // 대상을 목적 경로의 부모 디렉토리로 이동
    fs.moveSync(tarDir, destDir)
    return sliceRootDir(rootDir, destDir)
}
export default {
    getDocsDir,
    isSubdir,
    ensureDir,
    readTreeDirs,
    readFile,
    writeDir,
    writeFile,
    remove,
    rename,
    move,
}
