interface IResponse {
    result: boolean
    message: string | null
    data: Record<string, any>
    error?: IError
}
