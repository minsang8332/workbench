interface IAppState {
    drawer: boolean
    modal: boolean
    modalProps: {
        message: string | string[] | null
        ok: (() => void) | null
    }
    menu: boolean
    inputPath: string | null
}
interface IDiaryState {
    diaries: IDiary[]
}
interface IDiary {
    path: string
    isDir: boolean
    createdAt: number
    updatedAt: number
}
interface IDiaryWithPreview extends IDiary {
    preview: string
}
