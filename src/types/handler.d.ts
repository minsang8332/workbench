interface IHandlerResponse {
    data: object
    error?: HandlerError
}
interface IHandlerError {
    name: string | null
    message: string | null
}
