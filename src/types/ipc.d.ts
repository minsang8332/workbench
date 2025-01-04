namespace IpcController {
    interface IError {
        name: string | null
        message: string | null
    }
    interface IResponse {
        result: boolean
        message: string | null
        data: Record<string, any>
        error?: IError
    }
    namespace Request {
        namespace App {
            interface ILoadOverlayVideos {}
        }
        namespace Diary {
            interface ILoad {}
            // 문서 내용 가져오기
            interface IRead {
                filepath: string /* 가져올 파일 경로 */
            }
            // 문서 저장
            interface IWrite {
                filepath: string /* 저장할 파일 경로 */
                filename?: string
                text?: string /* 파일 내용 */
                ext?: string /* 확장자명 */
            }
            // 문서 폴더 생성
            interface IWriteDir {
                dirpath: string
                dirname: string
            }
            interface IRemove {
                filepath: string
            }
            interface IRename {
                filepath: string
                filename: string
            }
            interface IMove {
                frompath: string /* 무엇을 옮길지 경로*/
                destpath: string /* 어디로 옮길지 경로 */
            }
        }
        // 해야 할 일
        namespace Todo {
            interface ILoad {}
            // 저장하기
            interface ISave {
                id: ITodo['id']
                title: ITodo['title']
                description: ITodo['description']
                status: ITodo['status']
                tasks: ITodo['tasks']
                startedAt: ITodo['startedAt']
                endedAt: ITodo['endedAt']
            }
            // 제거하기
            interface IRemove {
                id: ITodo.id
            }
        }
        // 설정하기
        namespace Setting {
            interface ILoadPasscode {}
            // 패스코드 변경하기
            interface IUpdatePasscode {
                text: IPasscode['text']
            }
            // 패스코드 검증하기
            interface IVerifyPasscode {
                text: IPasscode['text']
            }
            // 패스코드 활성화
            interface IActivatePasscode {
                active: IPasscode['active']
            }
        }
    }
}
