interface IAppState {
    modal: boolean
    modalProps: IAppModalProps
    menu: boolean,
    menuProps: IAppMenuProps,
}
interface IAppModalProps {
    title?: string
    message: string | string[] | null
    ok: (() => void) | null
}
interface IDiaryState {
    drawer: boolean,
    diaries: IDiary[],
}
interface IAppMenuProps {
    pageX: number
    pageY: number
    items?: IAppMenuItem[]
}
interface IAppMenuItem {
    name: string
    icon: string
    color: string
    desc: string
    shortcut: string
    cb?: () => void
}
interface IDiary {
    path: string
    filename?: string
    isDir: boolean
    createdAt: number
    updatedAt: number
}
interface IDiaryWithPreview extends IDiary {
    preview: string
}
interface ITodoState {
    todos: ITodo[]
    status: ITodoStatus[]
}
interface ITodo  {
    id?: string
    title: string // 제목
    description: string // 내용
    status: ITodoStatus.value // 상태
    tasks: ITodoTask[] // 소작업
    startedAt: Date | null // 시작일
    endedAt: Date | null // 목표일
    createdAt?: Date | null
    updatedAt?: Date | null
}
interface ITodoTask  {
    id?: string
    title: string
    description: string
    checked: boolean
    startedAt: Date | null
    endedAt: Date | null
    createdAt?: Date | null
    updatedAt?: Date | null
}
interface ITodoStatus {
    label: string
    value: number
}
