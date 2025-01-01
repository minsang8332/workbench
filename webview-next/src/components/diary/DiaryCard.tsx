import _ from 'lodash'
import { defineComponent, type PropType } from 'vue'
import dayjs from 'dayjs'
import { useDiary } from '@/composables/useDiary'
import DiaryTextField from '@/components/diary/DiaryTextField'
import MarkdownPreview from '@/components/ui/MarkdownPreview'
import '@/components/diary/DiaryCard.scoped.scss'
export default defineComponent({
    name: 'DiaryCard',
    components: {
        DiaryTextField,
        MarkdownPreview
    },
    props: {
        filename: {
            type: [String, null] as PropType<string | null>,
            default: null
        },
        path: {
            type: String as PropType<string>,
            default: '/'
        },
        text: {
            type: [String, null] as PropType<string | null>,
            default: null
        },
        createdAt: {
            type: [Date, null] as PropType<Date | null>,
            default: null
        },
        updatedAt: {
            type: [Date, null] as PropType<Date | null>,
            default: null
        },
        width: {
            type: [String, null] as PropType<string | null>,
            default: '100%'
        }
    },
    setup(props) {
        const { renameRef, updateRename, openContextMenu } = useDiary()
        const printDate = (ts: Date | null) => {
            let print = null
            if (ts) {
                const date = dayjs(new Date(ts))
                if (date.isValid()) {
                    print = date.format('YYYY.MM.DD HH:mm:ss')
                }
            }
            return print
        }
        const onMouseup = (event: MouseEvent) => {
            openContextMenu(event, {
                path: props.path,
                interceptItems(items: IContextMenuItem[]) {
                    return items.filter(
                        (item: IContextMenuItem) => !_.includes(['add-folder', 'add'], item.name)
                    )
                }
            })
        }
        return () => (
            <div class="diary-card" onMouseup={onMouseup}>
                <div class="diary-card__header flex justify-between items-center px-2">
                    {renameRef.value ? (
                        <diary-text-field
                            path={props.path}
                            onUpdate={updateRename}
                            onClick={(event: MouseEvent) => event.stopPropagation()}
                        />
                    ) : (
                        <p>{props.filename}</p>
                    )}
                </div>
                <div class="diary-card__content">
                    <markdown-preview value={props.text} />
                </div>
                <div class="diary-card__footer flex flex-start flex-col justify-evenly px-2">
                    <p>작성일 {printDate(props.createdAt)}</p>
                    <p>수정일 {printDate(props.updatedAt)}</p>
                </div>
            </div>
        )
    }
})
