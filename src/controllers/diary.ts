import _ from 'lodash'
import path from 'path'
import fs from 'fs-extra'
import { app, ipcMain, shell } from 'electron'
import { controller } from '@/utils/ipc'
import { IPCError } from '@/errors/ipc'
import { IPC_DIARY_CHANNEL } from '@/constants/ipc'
import type { IDiary } from '@/types/model'
import type { IPCRequest, IPCResponse } from '@/types/ipc'
const rootDir = path.resolve(path.resolve(app.getPath('appData'), app.getName()), 'diary')
const isSubdir = async (parent: string, child: string) => {
    parent = path.resolve(parent)
    child = path.resolve(child)
    if (parent === child) {
        return true
    }
    const rel = path.relative(await fs.promises.realpath(parent), await fs.promises.realpath(child))
    return rel && !rel.includes('..')
}
const sliceRootDir = (rootDir: string, destDir: string) => {
    return destDir.replace(rootDir, '').replace(/\\/g, '/')
}
// 앱 실행할 때 폴더 초기화
fs.ensureDirSync(rootDir, { mode: 0o2775 })
// 문서함 열기
ipcMain.on(IPC_DIARY_CHANNEL.OPEN_DIR, () => shell.openPath(rootDir))
// 모든 문서 목록
controller(IPC_DIARY_CHANNEL.LOAD, async (request: IPCRequest.Diary.ILoad, response: IPCResponse.IBase) => {
    const diaries: IDiary[] = []
    const search = async (destDir = '/') => {
        const stats = fs.lstatSync(destDir)
        let isDir = false
        if (stats.isDirectory()) {
            isDir = true
            const files = fs.readdirSync(destDir)
            await Promise.all(files.map((file) => search(path.join(destDir, file))))
        }
        diaries.push({
            path: sliceRootDir(rootDir, destDir),
            isDir,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime,
        })
    }
    await search(rootDir)
    response.data.diaries = diaries
    return response
})
// 문서 내용 가져오기
controller(IPC_DIARY_CHANNEL.READ, (request: IPCRequest.Diary.IRead, response: IPCResponse.IBase) => {
    let text = null
    if (_.isEmpty(request.filepath)) {
        throw new IPCError('문서 경로를 입력해 주세요.')
    }
    const filepath = path.join(rootDir, request.filepath)
    text = fs.readFileSync(filepath, 'utf8')
    response.data.text = text
    return response
})
// 문서 저장
controller(IPC_DIARY_CHANNEL.WRITE, async (request: IPCRequest.Diary.IWrite, response: IPCResponse.IBase) => {
    let filepath = request.filepath
    if (_.isEmpty(filepath)) {
        filepath = '/'
    }
    let destDir = path.join(rootDir, request.filepath)
    if (!(await isSubdir(rootDir, destDir))) {
        throw new IPCError('유효하지 않은 경로 입니다.')
    }
    // 파일로 들어온 경우 부모 경로로 자동설정
    if (!(await fs.lstat(destDir)).isDirectory()) {
        destDir = path.dirname(destDir)
    }
    let ext = request.ext
    if (!_.isString(ext)) {
        ext = '.txt'
    }
    // 파일명이 없으면 신규 파일로 간주
    let filename = request.filename
    if (_.isNil(filename)) {
        let counts = 1
        let newers = '새 문서'
        for (const file of fs.readdirSync(destDir)) {
            // 파일만 처리하고 폴더는 무시한다
            if (fs.lstatSync(path.join(destDir, file)).isDirectory()) {
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
    fs.writeFileSync(path.format({ dir: destDir, name: filename, ext }), text)
    response.data.filename = filename
    return response
})
// 문서 폴더 생성
controller(IPC_DIARY_CHANNEL.WRITE_DIR, async (request: IPCRequest.Diary.IWriteDir, response: IPCResponse.IBase) => {
    let dirpath = request.dirpath
    if (_.isEmpty(dirpath)) {
        dirpath = '/'
    }
    dirpath = path.join(rootDir, request.dirpath)
    if (!(await isSubdir(rootDir, dirpath))) {
        throw new IPCError('유효하지 않은 경로 입니다.')
    }
    // 파일로 들어온 경우 부모 경로로 자동설정
    if (!(await fs.lstat(dirpath)).isDirectory()) {
        dirpath = path.dirname(dirpath)
    }
    // 폴더명이 지정되지 않았다면
    let dirname = request.dirname
    if (_.isNil(dirname)) {
        let counts = 1
        let newers = '새 폴더'
        for (const file of fs.readdirSync(dirpath)) {
            // 파일은 무시
            if (!fs.lstatSync(path.join(dirpath, file)).isDirectory()) {
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
    dirpath = path.join(dirpath, dirname)
    fs.ensureDir(dirpath)
    response.data.dirname = dirname
    return response
})
// 문서 삭제
controller(IPC_DIARY_CHANNEL.DELETE, async (request: IPCRequest.Diary.IDelete, response: IPCResponse.IBase) => {
    let filepath = request.filepath
    if (_.isEmpty(filepath)) {
        filepath = '/'
    }
    filepath = path.join(rootDir, filepath)
    if (!(await isSubdir(rootDir, filepath))) {
        throw new IPCError('문서를 제거 할 수 없습니다.')
    }
    await fs.rm(filepath, {
        recursive: true,
        force: true,
    })
    const fileinfo = path.parse(filepath)
    response.data.filename = fileinfo.base
    return response
})
// 문서 이름 변경
controller(IPC_DIARY_CHANNEL.RENAME, async (request: IPCRequest.Diary.IRename, response: IPCResponse.IBase) => {
    let filepath = request.filepath
    if (_.isEmpty(filepath)) {
        filepath = '/'
    }
    filepath = path.join(rootDir, filepath)
    if (!(await isSubdir(rootDir, filepath))) {
        throw new IPCError('유효하지 않은 경로 입니다.')
    }
    const fromParsed = path.parse(filepath)
    const destParsed = path.parse(request.filename)
    // 새로운 경로를 생성
    const renameDir = path.format({
        dir: fromParsed.dir,
        name: destParsed.name,
        ext: destParsed.ext,
    })
    if (fs.existsSync(renameDir)) {
        throw new IPCError('이미 존재하는 파일명 입니다.')
    }
    fs.renameSync(filepath, renameDir)
    response.data.filepath = sliceRootDir(rootDir, renameDir)
    return response
})
// 문서 이동
controller(IPC_DIARY_CHANNEL.MOVE, async (request: IPCRequest.Diary.IMove, response: IPCResponse.IBase) => {
    let frompath = request.frompath
    if (_.isEmpty(frompath)) {
        frompath = '/'
    }
    frompath = path.join(rootDir, frompath)
    let destpath = request.destpath
    if (_.isEmpty(destpath)) {
        destpath = '/'
    }
    destpath = path.join(rootDir, destpath)
    // 목적지가 대상의 하위 상위 경로인 경우
    if (await isSubdir(frompath, destpath)) {
        throw new IPCError('하위 경로로 이동할 수 없습니다.')
    }
    const fromParsed = path.parse(frompath)
    const destParsed = path.parse(destpath)
    if (fromParsed.base == destParsed.base) {
        throw new IPCError('대상과 이동할 곳의 이름이 일치하여 덮어 쓸 수 없습니다.')
    }
    // 목적지가 파일인 경우
    if (fs.lstatSync(destpath).isFile()) {
        destpath = path.join(destParsed.dir, fromParsed.base)
    } else {
        destpath = path.join(destpath, fromParsed.base)
    }
    if (frompath == destpath) {
        throw new IPCError('목적지가 현재 경로 입니다.')
    }
    // 대상을 목적 경로의 부모 디렉토리로 이동
    fs.moveSync(frompath, destpath)
    response.data.filename = sliceRootDir(rootDir, destpath)
    return response
})
