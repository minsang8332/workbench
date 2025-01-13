interface IContextMenuItem {
    name: string
    icon: string
    color?: string
    desc: string
    shortcut: string
    cb?: () => void
}
interface IContextMenuProps {
    pageX: number
    pageY: number
    items?: IContextMenuItem[]
}
interface IModalDialogProps {
    title?: string
    message: string | string[] | null
    persistent?: false
    hideActions?: false
    ok?: () => void
    cancel?: () => void
}
