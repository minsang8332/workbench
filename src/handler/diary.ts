import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { app } from 'electron'
import { ipcMain, shell } from 'electron'
import handlerTool from '@/tools/handler'
const allowExts = ['.md', '.txt']
const rootDir = path.resolve(path.resolve(app.getPath('documents'), app.getName()), 'diary')
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
    return rel && !rel.includes('..')
}
const sliceRootDir = (rootDir: string, target: string) => {
    return target.replace(rootDir, '').replace(/\\/g, '/')
}
// 앱 실행할 때 폴더 초기화
fs.ensureDirSync(rootDir, { mode: 0o2775 })
// 문서함 열기
ipcMain.on('diary:open-dir', () => shell.openPath(rootDir))
// 모든 문서 목록
ipcMain.handle('diary:read-all', async () => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        const diaries: IDiary[] = []
        const search = async (target = '/') => {
            const stats = fs.lstatSync(target)
            let isDir = false
            if (stats.isDirectory()) {
                isDir = true
                const files = fs.readdirSync(target)
                await Promise.all(
                    files.map((file) => search(path.join(target, file)))
                )
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
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서 내용 가져오기
ipcMain.handle('diary:read', async (event, payload: IpcPayload.Diary.IRead) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        let text = null
        if (payload && payload.target) {
            const target = path.join(rootDir, payload.target)
            text = fs.readFileSync(target, 'utf8')
        }
        response.data = { 
            text 
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
ipcMain.handle('diary:write', async (event, payload: IpcPayload.Diary.IWrite) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        let target = path.join(rootDir, payload.target)
        if (!(await isSubdir(rootDir, target))) {
            throw new Error('유효하지 않은 경로 입니다.')
        }
        // 파일로 들어온 경우 부모 경로로 자동설정
        if (!(await fs.lstat(target)).isDirectory()) {
            target = path.dirname(target)
        }
        let ext = payload.ext
        if (!_.isString(ext)) {
            ext = '.md'
        }
        ext = /^\.(\w)+/.test(ext) ? ext : `.${ext}`
        if (!_.includes(allowExts, ext)) {
            throw new Error(
                `작성 가능한 확장자는 다음과 같습니다. (${allowExts.join(',')})`
            )
        }
        // 파일명이 없으면 신규 파일로 간주
        let filename = payload.filename
        if (_.isNil(filename)) {
            let counts = 0
            let newers = '새 문서'
            for (const file of fs.readdirSync(target)) {
                // 폴더는 무시
                if (fs.lstatSync(path.join(target, file)).isDirectory()) {
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
        let text = payload.text
        if (!_.isString(text)) {
            text = ''
        }
        fs.writeFileSync(path.format({ dir: target, name: filename, ext }), text)
        response.data = {
            writed: filename,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서 경로 추가
ipcMain.handle('diary:write-dir', async (event, payload: IpcPayload.Diary.IWriteDir) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        let target = path.join(rootDir, payload.target)
        if (!(await isSubdir(rootDir, target))) {
            throw new Error('유효하지 않은 경로 입니다.')
        }
        // 파일로 들어온 경우 부모 경로로 자동설정
        if (!(await fs.lstat(target)).isDirectory()) {
            target = path.dirname(target)
        }
        // 폴더명이 지정되지 않았다면
        let dirname = payload.dirname
        if (_.isNil(dirname)) {
            let counts = 0
            let newers = '새 폴더'
            for (const file of fs.readdirSync(target)) {
                // 파일은 무시
                if (!fs.lstatSync(path.join(target, file)).isDirectory()) {
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
        target = path.join(target, dirname)
        fs.ensureDir(target)
        response.data = {
            writed: dirname,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서 삭제
ipcMain.handle('diary:remove', async (event, payload: IpcPayload.Diary.IRemove) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        let target = payload.target
        if (!_.isString(target)) {
            target = '/'
        }
        target = path.join(rootDir, target)
        if (!await isSubdir(rootDir, target)) {
            throw new Error('문서를 제거 할 수 없습니다.')
        }
        await fs.rm(target, { 
            recursive: true, 
            force: true 
        })
        const fileinfo = path.parse(target)
        response.data = {
            removed: fileinfo.base,
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서명 변경
ipcMain.handle('diary:rename', async (event, payload: IpcPayload.Diary.IRename) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        let target = payload.target
        if (!_.isString(target)) {
            target = '/'
        }
        target = path.join(rootDir, target)
        if (!(await isSubdir(rootDir, target))) {
            throw new Error('유효하지 않은 경로 입니다.')
        }
        const src = path.parse(target)
        const dest = path.parse(payload.rename)
        if (!_.includes(allowExts, dest.ext)) {
            throw new Error(
                `작성 가능한 확장자는 다음과 같습니다. (${allowExts.join(',')})`
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
        fs.renameSync(target, renameDir)
        response.data = {
            renamed: sliceRootDir(rootDir, renameDir),
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
// 문서 이동
ipcMain.handle('diary:move', async (event, payload: IpcPayload.Diary.IMove) => {
    let response: IpcHandle.IResponse = handlerTool.createResponse()
    try {
        let target = payload.target
        if (!_.isString(target)) {
            target = '/'
        }
        target = path.join(rootDir, target)
        let dest = payload.dest
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
            throw new Error(
                '대상과 이동할 곳의 이름이 일치하여 덮어 쓸 수 없습니다.'
            )
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
            moved: sliceRootDir(rootDir, dest)
        }
    } catch (e) {
        response.error = handlerTool.createError(e)
    }
    return response
})
