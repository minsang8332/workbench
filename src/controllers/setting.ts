import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import commonUtil from '@/utils/common'
import { controller } from '@/utils/ipc'
import { IPC_SETTING } from '@/constants/ipc'
import { Passcode } from '@/models/passcode'
// 패스코드 정보 가져오기
controller(
    IPC_SETTING.LOAD_PASSCODE,
    async (request: IpcController.Request.Setting.ILoadPasscode, response: IpcController.IResponse) => {
        const programDir = await commonUtil.getProgramDir()
        if (_.isNull(programDir)) {
            throw new Error('프로그램의 내부 접근 권한이 없습니다.')
        }
        const passcodePath = path.resolve(programDir, '.passcode')
        // 파일이 없다면
        if (fs.existsSync(passcodePath) == false) {
            fs.writeFileSync(passcodePath, JSON.stringify(new Passcode({ text: '', active: false })))
        }
        try {
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = new Passcode(JSON.parse(json))
            response.data.active = passcode.active
        } catch (e) {
            throw new Error('패스코드를 검증 시 오류가 발생했습니다.')
        }
        return response
    }
)
// 패스코드 검증하기
controller(
    IPC_SETTING.VERIFY_PASSCODE,
    async (request: IpcController.Request.Setting.IVerifyPasscode, response: IpcController.IResponse) => {
        if (_.isEmpty(request.text)) {
            throw new Error('패스코드가 입력되지 않았습니다.')
        }
        const programDir = await commonUtil.getProgramDir()
        if (_.isNull(programDir)) {
            throw new Error('프로그램의 내부 접근 권한이 없습니다.')
        }
        const passcodePath = path.resolve(programDir, '.passcode')
        if (fs.existsSync(passcodePath) == false) {
            throw new Error('패스코드 정보를 확인 할 수 없습니다.')
        }
        /**
         * 💡TODO
         * 배포 환경변수 (dot-env) 설정 작업 이후
         * 환경변수를 이용하여 대칭키 복호화하여 비교 할 것
         */
        try {
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = new Passcode(JSON.parse(json))
            if (!(passcode.text == request.text)) {
                throw new Error('입력한 패스코드는 일치하지 않습니다.')
            }
        } catch (e) {
            throw new Error('패스코드를 검증 시 오류가 발생했습니다.')
        }
        return response
    }
)
// 패스코드 변경하기
controller(
    IPC_SETTING.UPDATE_PASSCODE,
    async (request: IpcController.Request.Setting.IUpdatePasscode, response: IpcController.IResponse) => {
        if (_.isEmpty(request.text)) {
            throw new Error('패스코드가 입력되지 않았습니다.')
        }
        const programDir = await commonUtil.getProgramDir()
        if (_.isNull(programDir)) {
            throw new Error('프로그램의 내부 접근 권한이 없습니다.')
        }
        const passcodePath = path.resolve(programDir, '.passcode')
        // 파일이 없다면
        if (fs.existsSync(passcodePath) == false) {
            fs.writeFileSync(passcodePath, JSON.stringify(new Passcode({ text: '', active: false })))
        }
        // 파일이 유효하지 않다면 제거해야하므로 try-catch
        try {
            // 패스코드 파일을 불러온다
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = new Passcode(JSON.parse(json))
            /**
             * 💡TODO
             * 배포 환경변수 (dot-env) 설정 작업 이후
             * 환경변수를 이용하여 대칭키 암호화 할 것
             */
            passcode.text = request.text
            fs.writeFileSync(passcodePath, JSON.stringify(passcode))
        } catch (e) {
            fs.removeSync(passcodePath)
            throw new Error('패스코드를 다시 입력해 주세요')
        }
        return response
    }
)
// 패스코드 활성화
controller(
    IPC_SETTING.ACTIVATE_PASSCODE,
    async (request: IpcController.Request.Setting.IActivatePasscode, response: IpcController.IResponse) => {
        if (!_.isBoolean(request.active)) {
            throw new Error('패스코드 활성화 여부가 입력되지 않았습니다.')
        }
        const programDir = await commonUtil.getProgramDir()
        if (_.isNull(programDir)) {
            throw new Error('프로그램의 내부 접근 권한이 없습니다.')
        }
        const passcodePath = path.resolve(programDir, '.passcode')
        // 파일이 없다면
        if (fs.existsSync(passcodePath) == false) {
            fs.writeFileSync(passcodePath, JSON.stringify(new Passcode({ text: '', active: request.active })))
            return response
        }
        try {
            const json = fs.readFileSync(passcodePath, 'utf-8')
            const passcode = new Passcode(JSON.parse(json))
            passcode.active = request.active
            fs.writeFileSync(passcodePath, JSON.stringify(passcode))
        } catch (e) {
            fs.removeSync(passcodePath)
            throw new Error('패스코드를 활성화 시 오류가 발생했습니다.')
        }
        return response
    }
)
