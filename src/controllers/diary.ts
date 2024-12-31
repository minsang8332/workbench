import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { app, ipcMain, shell } from 'electron'
import { controller } from '@/utils/ipc'
import { IPC_DIARY } from '@/constants/ipc'
const allowExts = ['.md', '.txt']
const rootDir = path.resolve(path.resolve(app.getPath('documents'), app.getName()), 'diary')
const isSubdir = async (parent: string, child: string) => {
    parent = path.resolve(parent)
    child = path.resolve(child)
    if (parent === child) {
        return true
    }
    const rel = path.relative(await fs.promises.realpath(parent), await fs.promises.realpath(child))
    return rel && !rel.includes('..')
}
const sliceRootDir = (rootDir: string, target: string) => {
    return target.replace(rootDir, '').replace(/\\/g, '/')
}
// 앱 실행할 때 폴더 초기화
fs.ensureDirSync(rootDir, { mode: 0o2775 })
// 문서함 열기
ipcMain.on(IPC_DIARY.OPEN_DIR, () => shell.openPath(rootDir))
// 모든 문서 목록
controller(IPC_DIARY.LOAD, async (request: IpcController.Request.Diary.ILoad, response: IpcController.IResponse) => {
    const diaries: IDiary[] = []
    const search = async (target = '/') => {
        const stats = fs.lstatSync(target)
        let isDir = false
        if (stats.isDirectory()) {
            isDir = true
            const files = fs.readdirSync(target)
            await Promise.all(files.map((file) => search(path.join(target, file))))
        } else {
            if (!allowExts.includes(path.extname(target))) {
                return
            }
        }
        diaries.push({
            path: sliceRootDir(rootDir, target),
            isDir,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
        })
    }
    await search(rootDir)
    response.data = {
        diaries,
    }
    return response
})
// 문서 내용 가져오기
controller(IPC_DIARY.READ, (request: IpcController.Request.Diary.IRead, response: IpcController.IResponse) => {
    let text = null
    if (request && request.target) {
        const target = path.join(rootDir, request.target)
        text = fs.readFileSync(target, 'utf8')
    }
    response.data = {
        text,
    }
    return response
})
// 문서 저장
controller(IPC_DIARY.WRITE, async (request: IpcController.Request.Diary.IWrite, response: IpcController.IResponse) => {
    let target = path.join(rootDir, request.target)
    if (!(await isSubdir(rootDir, target))) {
        throw new Error('유효하지 않은 경로 입니다.')
    }
    // 파일로 들어온 경우 부모 경로로 자동설정
    if (!(await fs.lstat(target)).isDirectory()) {
        target = path.dirname(target)
    }
    let ext = request.ext
    if (!_.isString(ext)) {
        ext = '.md'
    }
    ext = /^\.(\w)+/.test(ext) ? ext : `.${ext}`
    if (!_.includes(allowExts, ext)) {
        throw new Error(`작성 가능한 확장자는 다음과 같습니다. (${allowExts.join(',')})`)
    }
    // 파일명이 없으면 신규 파일로 간주
    let filename = request.filename
    if (_.isNil(filename)) {
        let counts = 1
        let newers = '새 문서'
        for (const file of fs.readdirSync(target)) {
            // 폴더는 무시
            if (fs.lstatSync(path.join(target, file)).isDirectory()) {
                continue
            }
            const { name } = path.parse(file)
            if (name !== `${newers} ${counts}`) {
                continue
            }
            counts++
        }
        filename = `${newers} ${counts}`
    }
    let text = request.text
    if (!_.isString(text)) {
        text = ''
    }
    fs.writeFileSync(path.format({ dir: target, name: filename, ext }), text)
    response.data = {
        writed: filename,
    }
    return response
})
// 문서 경로 추가
controller(
    IPC_DIARY.WRITE_DIR,
    async (request: IpcController.Request.Diary.IWriteDir, response: IpcController.IResponse) => {
        let target = path.join(rootDir, request.target)
        if (!(await isSubdir(rootDir, target))) {
            throw new Error('유효하지 않은 경로 입니다.')
        }
        // 파일로 들어온 경우 부모 경로로 자동설정
        if (!(await fs.lstat(target)).isDirectory()) {
            target = path.dirname(target)
        }
        // 폴더명이 지정되지 않았다면
        let dirname = request.dirname
        if (_.isNil(dirname)) {
            let counts = 1
            let newers = '새 폴더'
            for (const file of fs.readdirSync(target)) {
                // 파일은 무시
                if (!fs.lstatSync(path.join(target, file)).isDirectory()) {
                    continue
                }
                const { name } = path.parse(file)
                if (name !== `${newers} ${counts}`) {
                    continue
                }
                counts++
            }
            dirname = `${newers} ${counts}`
        }
        target = path.join(target, dirname)
        fs.ensureDir(target)
        response.data = {
            writed: dirname,
        }
        return response
    }
)
// 문서 삭제
controller(
    IPC_DIARY.REMOVE,
    async (request: IpcController.Request.Diary.IRemove, response: IpcController.IResponse) => {
        let target = request.target
        if (!_.isString(target)) {
            target = '/'
        }
        target = path.join(rootDir, target)
        if (!(await isSubdir(rootDir, target))) {
            throw new Error('문서를 제거 할 수 없습니다.')
        }
        await fs.rm(target, {
            recursive: true,
            force: true,
        })
        const fileinfo = path.parse(target)
        response.data = {
            removed: fileinfo.base,
        }
        return response
    }
)
// 문서명 변경
controller(
    IPC_DIARY.RENAME,
    async (request: IpcController.Request.Diary.IRename, response: IpcController.IResponse) => {
        let target = request.target
        if (!_.isString(target)) {
            target = '/'
        }
        target = path.join(rootDir, target)
        if (!(await isSubdir(rootDir, target))) {
            throw new Error('유효하지 않은 경로 입니다.')
        }
        const src = path.parse(target)
        const dest = path.parse(request.rename)
        if (!_.includes(allowExts, dest.ext)) {
            throw new Error(`작성 가능한 확장자는 다음과 같습니다. (${allowExts.join(',')})`)
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
        fs.renameSync(target, renameDir)
        response.data = {
            renamed: sliceRootDir(rootDir, renameDir),
        }
        return response
    }
)
// 문서 이동
controller(IPC_DIARY.MOVE, async (request: IpcController.Request.Diary.IMove, response: IpcController.IResponse) => {
    let target = request.target
    if (!_.isString(target)) {
        target = '/'
    }
    target = path.join(rootDir, target)
    let dest = request.dest
    if (!_.isString(dest)) {
        dest = '/'
    }
    dest = path.join(rootDir, dest)
    // 목적지가 대상의 하위 상위 경로인 경우
    if (await isSubdir(target, dest)) {
        throw new Error('하위 경로로 이동할 수 없습니다.')
    }
    const tarParsed = path.parse(target)
    const destParsed = path.parse(dest)
    if (tarParsed.base == destParsed.base) {
        throw new Error('대상과 이동할 곳의 이름이 일치하여 덮어 쓸 수 없습니다.')
    }
    // 목적지가 파일인 경우
    if (fs.lstatSync(dest).isFile()) {
        dest = path.join(destParsed.dir, tarParsed.base)
    } else {
        dest = path.join(dest, tarParsed.base)
    }
    if (target == dest) {
        throw new Error('목적지가 현재 경로 입니다.')
    }
    // 대상을 목적 경로의 부모 디렉토리로 이동
    fs.moveSync(target, dest)
    response.data = {
        moved: sliceRootDir(rootDir, dest),
    }
    return response
})
