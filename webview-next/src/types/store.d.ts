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
