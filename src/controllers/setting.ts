import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import url from 'url'
import { app, dialog } from 'electron'
import windowUtil from '@/utils/window'
import commonUtil from '@/utils/common'
import { controller } from '@/utils/ipc'
import { IPCError } from '@/errors/ipc'
import { IPC_SETTING_CHANNEL } from '@/constants/ipc'
import { PROTOCOL } from '@/constants/app'
import type { IPCRequest, IPCResponse } from '@/types/ipc'
// 패스코드 정보 가져오기
controller(
    IPC_SETTING_CHANNEL.LOAD_PASSCODE,
    async (request: IPCRequest.Setting.ILoadPasscode, response: IPCResponse.IBase) => {
        const passcodePath = path.join(app.getPath('userData'), '.passcode')
        if (!commonUtil.isAvailablePath(passcodePath)) {
            throw new IPCError('관리자 권한으로 실행해 주세요.')
        }
        try {
            if (!fs.existsSync(passcodePath)) {
                const passcode: IPasscode = { text: '', active: false }
                fs.writeFileSync(passcodePath, JSON.stringify(passcode))
            }
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = JSON.parse(json)
            response.data.empty = _.isEmpty(passcode.text)
            response.data.active = passcode.active
        } catch (e) {
            throw new IPCError('패스코드 검증 중 오류가 발생했습니다.')
        }
        return response
    }
)
// 패스코드 검증하기
controller(
    IPC_SETTING_CHANNEL.VERIFY_PASSCODE,
    async (request: IPCRequest.Setting.IVerifyPasscode, response: IPCResponse.IBase) => {
        if (_.isEmpty(request.text)) {
            throw new IPCError('패스코드가 입력되지 않았습니다.')
        }
        const passcodePath = path.join(app.getPath('userData'), '.passcode')
        if (!fs.existsSync(passcodePath)) {
            throw new IPCError('패스코드 정보를 확인 할 수 없습니다.')
        }
        /**
         * 💡TODO
         * 배포 환경변수 (dot-env) 설정 작업 이후
         * 환경변수를 이용하여 대칭키 복호화하여 비교 할 것
         */
        try {
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = JSON.parse(json)
            response.result = passcode.text == request.text
        } catch (e) {
            throw e
        }
        return response
    }
)
// 패스코드 변경하기
controller(
    IPC_SETTING_CHANNEL.UPDATE_PASSCODE,
    async (request: IPCRequest.Setting.IUpdatePasscode, response: IPCResponse.IBase) => {
        if (_.isEmpty(request.text)) {
            throw new IPCError('패스코드가 입력되지 않았습니다.')
        }
        const passcodePath = path.join(app.getPath('userData'), '.passcode')
        if (!commonUtil.isAvailablePath(passcodePath)) {
            throw new IPCError('관리자 권한으로 실행해 주세요.')
        }
        try {
            if (!fs.existsSync(passcodePath)) {
                const passcode: IPasscode = { text: '', active: false }
                fs.writeFileSync(passcodePath, JSON.stringify(passcode))
            }
            // 패스코드 파일을 불러온다
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = JSON.parse(json)
            /**
             * 💡TODO
             * 배포 환경변수 (dot-env) 설정 작업 이후
             * 환경변수를 이용하여 대칭키 암호화 할 것
             */
            if (passcode.text == request.text) {
                response.message = '기존 패스코드와 일치합니다. 다시 입력해 주세요'
                return response
            }
            passcode.text = request.text
            fs.writeFileSync(passcodePath, JSON.stringify(passcode))
        } catch (e) {
            fs.removeSync(passcodePath)
            throw new IPCError('패스코드 변경 중 오류가 발생했습니다.')
        }
        return response
    }
)
// 패스코드 활성화
controller(
    IPC_SETTING_CHANNEL.ACTIVATE_PASSCODE,
    async (request: IPCRequest.Setting.IActivatePasscode, response: IPCResponse.IBase) => {
        if (!_.isBoolean(request.active)) {
            throw new IPCError('패스코드 활성화 여부가 입력되지 않았습니다.')
        }
        const passcodePath = path.join(app.getPath('userData'), '.passcode')
        if (!fs.existsSync(passcodePath)) {
            const passcode: IPasscode = { text: '', active: false }
            fs.writeFileSync(passcodePath, JSON.stringify(passcode))
        }
        const json = fs.readFileSync(passcodePath, 'utf-8')
        const passcode = JSON.parse(json)
        if (_.isEmpty(passcode.text)) {
            throw new IPCError('패스코드를 변경해 주세요.')
        }
        try {
            passcode.active = request.active
            fs.writeFileSync(passcodePath, JSON.stringify(passcode))
            response.data.active = passcode.active
        } catch (e) {
            fs.removeSync(passcodePath)
            throw new IPCError('패스코드 활성화 중 오류가 발생했습니다.')
        }
        return response
    }
)
// 오버레이 비디오 정보 가져오기
controller(
    IPC_SETTING_CHANNEL.LOAD_OVERLAY_VIDEOS,
    async (request: IPCRequest.App.ILoadOverlayVideos, response: IPCResponse.IBase) => {
        const overlayVideoPath = path.join(app.getPath('userData'), '.overlay-video')
        if (!fs.existsSync(overlayVideoPath)) {
            throw new IPCError('오버레이 경로 파일을 찾을 수 없습니다.')
        }
        const json = fs.readFileSync(overlayVideoPath, 'utf-8')
        const overlayVideo: IOverlayVideo = JSON.parse(json)
        if (!fs.existsSync(overlayVideo.dirname)) {
            throw new IPCError('오버레이 경로가 아직 설정되지 않았습니다.')
        }
        try {
            const videos = fs
                .readdirSync(overlayVideo.dirname)
                .filter((file) => commonUtil.isVideoFile(file))
                .map((file) => {
                    const videoURL = url.pathToFileURL(path.join(overlayVideo.dirname, file))
                    return videoURL.toString().replace('file://', `${PROTOCOL.LOCAL}://`)
                })
            response.data.dirname = overlayVideo.dirname
            response.data.videos = videos
        } catch (e) {
            throw new IPCError('배경화면 (오버레이) 정보를 가져오는 중 오류가 발생했습니다.')
        }

        return response
    }
)
// 오버레이 비디오 경로 설정
controller(
    IPC_SETTING_CHANNEL.UPDATE_OVERLOAY_VIDEO,
    async (request: IPCRequest.App.IUpdateOverlayVideo, response: IPCResponse.IBase) => {
        const mainWindow = windowUtil.getMainWindow()
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
        })
        if (result.canceled) {
            return response
        }
        const dirname = _.first(result.filePaths)
        if (!(_.isString(dirname) && fs.lstatSync(dirname).isDirectory())) {
            throw new IPCError('옳바른 폴더를 선택해 주세요.')
        }
        const overlayVideoPath = path.join(app.getPath('userData'), '.overlay-video')
        try {
            const overlayVideo: IOverlayVideo = { dirname }
            fs.writeFileSync(overlayVideoPath, JSON.stringify(overlayVideo))
        } catch (e) {
            throw new IPCError('배경화면 (오버레이) 경로 변경 중 오류가 발생했습니다.')
        }
        return response
    }
)
