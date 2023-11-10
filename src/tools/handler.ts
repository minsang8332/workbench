export const createResponse = (props = {}): IHandlerResponse => {
    return {
        ...props,
        data: {},
    }
}
export const createError = (error?: Error | unknown): IHandlerError | null => {
    return error instanceof Error
        ? {
              name: error.name,
              message: error.message,
          }
        : null
}
export default {
    createResponse,
    createError,
}
