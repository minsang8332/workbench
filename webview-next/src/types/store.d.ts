interface IAppState {
    modal: boolean
    modalProps: IAppModalProps
}
interface IAppModalProps {
    title?: string
    message: string | string[] | null
    ok: (() => void) | null
}
interface IDiaryState {
    drawer: boolean,
    menu: boolean
    menuProps: IDiaryMenuProps,
    diaries: IDiary[],
}
interface IDiaryMenuProps {
    path: string | null
    isDir: boolean
    pageX: number
    pageY: number
    items?: IDiaryMenuItem[]
}
interface IDiaryMenuItem {
    name: string
    icon: string
    color: string
    desc: string
    shortcut: string
    cb?: () => void
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
