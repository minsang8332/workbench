export class IPCError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'IPCError'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, IPCError)
        }
    }
}
