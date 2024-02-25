import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import dayjs from 'dayjs'
import { app } from 'electron'
export const getDocsDir = () =>
    path.resolve(app.getPath('documents'), app.getName())
export const diaryexts = ['.md', '.txt']
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
    const docs: IFile[] = []
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
            if (!diaryexts.includes(path.extname(target))) {
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
    target: string = '/',
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
    let tarDir = path.join(rootDir, target)
    if (!(await isSubdir(rootDir, tarDir))) {
        throw new Error('유효하지 않은 경로 입니다.')
    }
    // 파일로 들어온 경우 부모 경로로 자동설정
    if (!(await fs.lstat(tarDir)).isDirectory()) {
        tarDir = path.dirname(tarDir)
    }
    ext = /^\.(\w)+/.test(ext) ? ext : `.${ext}`
    if (!_.includes(diaryexts, ext)) {
        throw new Error(
            `작성 가능한 확장자는 다음과 같습니다. (${diaryexts.join('|')})`
        )
    }
    // 파일명이 없으면 신규 파일로 간주
    if (_.isNil(filename)) {
        let counts = 0
        let newers = '새 문서'
        for (const file of fs.readdirSync(tarDir)) {
            // 폴더는 무시
            if (fs.lstatSync(path.join(tarDir, file)).isDirectory()) {
                continue
            }
            const { name } = path.parse(file)
            if (name !== `${newers} (${counts})`) {
                continue
            }
            counts++
        }
        filename = `${newers} (${counts})`
    }
    fs.writeFileSync(path.format({ dir: tarDir, name: filename, ext }), text)
    return filename
}
const writeDir = async (
    target: string = '/',
    {
        dirname,
        rootDir,
    }: {
        dirname?: string
        rootDir: string
    }
) => {
    let tarDir = path.join(rootDir, target)
    if (!(await isSubdir(rootDir, tarDir))) {
        throw new Error('유효하지 않은 경로 입니다.')
    }
    // 파일로 들어온 경우 부모 경로로 자동설정
    if (!(await fs.lstat(tarDir)).isDirectory()) {
        tarDir = path.dirname(tarDir)
    }
    // 폴더명이 지정되지 않았다면
    if (_.isNil(dirname)) {
        let counts = 0
        let newers = '새 폴더'
        for (const file of fs.readdirSync(tarDir)) {
            // 파일은 무시
            if (!fs.lstatSync(path.join(tarDir, file)).isDirectory()) {
                continue
            }
            const { name } = path.parse(file)
            if (name !== `${newers} (${counts})`) {
                continue
            }
            counts++
        }
        dirname = `${newers} (${counts})`
    }
    tarDir = path.join(tarDir, dirname)
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
    const src = path.parse(tarDir)
    const dest = path.parse(rename)
    if (!_.includes(diaryexts, dest.ext)) {
        throw new Error(
            `작성 가능한 확장자는 다음과 같습니다. (${diaryexts.join('|')})`
        )
    }
    // 새로운 경로를 생성
    const renameDir = path.format({
        dir: src.dir,
        name: dest.name,
        ext: dest.ext,
    })
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
    let tarDir = path.join(rootDir, target)
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
