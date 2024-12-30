export const createResponse = (props = {}): IpcHandle.IResponse => {
    return {
        ...props,
        data: {},
    }
}
export const createError = (error: Error): IpcHandle.IError | undefined => {
    switch ((error as NodeJS.ErrnoException).code) {
        case 'EBADF':
            error.message =
                '파일 디스크립터가 유효하지 않습니다. 권한을 확인해 주세요.'
        case 'EPERM':
            error.message = '운영체제의 작업 권한을 확인해주세요.'
            break
        case 'ENOENT':
            error.message =
                '파일이나 디렉토리를 찾을 수 없습니다 혹은 접근 권한을 확인해 주세요.'
            break
    }
    return error
}
export default {
    createResponse,
    createError,
}
