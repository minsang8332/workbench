import _ from 'lodash'
import { computed, defineComponent, ref, watch, inject, unref } from 'vue'
import type { PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import { useDiary } from '@/composables/useDiary'
import DiaryTextField from '@/components/diary/DiaryTextField'
import type { IDiary } from '@/types/model'
import './DiaryFile.scoped.scss'
export interface IDiaryFile extends IDiary {
    title: string
    parent: string
    items: IDiaryFile[]
}
export default defineComponent({
    name: 'DiaryFile',
    components: {
        DiaryTextField
    },
    props: {
        title: {
            type: String as PropType<string>,
            default: ''
        },
        path: {
            type: String as PropType<string>,
            default: ''
        },
        items: {
            type: Array as PropType<IDiaryFile[]>,
            default: () => []
        },
        isDir: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        depth: {
            type: Number as PropType<number>,
            default: 0
        },
        maxDepth: {
            type: Number as PropType<number>,
            default: 5
        }
    },
    setup(props) {
        const $toast = inject('toast') as IToastPlugin
        const router = useRouter()
        const route = useRoute()
        const diaryStore = useDiaryStore()
        const { renameRef, updateRename, openContextMenu } = useDiary()
        const slideRef = ref<boolean>(true)
        const printTitle = computed(() => {
            return props.depth == 0 ? `전체 (${diaryStore.cntDiaries})` : props.title
        })
        const isDir = computed(() => {
            return props.depth == 0 ? true : props.isDir
        })
        const getItems = computed(() => {
            let items = props.items
            if (props.depth == 0) {
                items = diaryStore.treeDiaries as IDiaryFile[]
            }
            return items.sort((a, b) => (b.isDir ? 1 : 0) - (a.isDir ? 1 : 0))
        })
        const onDblClick = () => {
            if (!props.path) {
                return
            }
            if (props.isDir) {
                return
            }
            router.replace({ name: 'diary-detail', params: { path: props.path } }).catch((e) => e)
        }
        const onPrevent = (event: DragEvent) => {
            event.preventDefault()
        }
        const onDragstart = (event: DragEvent, target: string = props.path) => {
            if (!(event && event.dataTransfer)) {
                return false
            }
            if (!target) {
                return false
            }
            event.dataTransfer.setData('dragstart-diary', target)
        }
        const onDrop = async (event: DragEvent) => {
            if (!(event && event.dataTransfer)) {
                return false
            }
            try {
                const frompath = event.dataTransfer.getData('dragstart-diary')
                const destpath = props.path
                if (!(frompath && frompath != destpath)) {
                    return false
                }
                const filename = await diaryStore.mvDiary({ frompath, destpath })
                // 현재 작성중인 문서인 경우
                if (route.params.path == frompath) {
                    return router
                        .replace({
                            name: 'diary-detail',
                            params: { path: filename }
                        })
                        .catch((e) => e)
                }
                await diaryStore.loadDiaries()
            } catch (e) {
                $toast.error(e as Error)
            }
        }
        const onMouseup = (event: MouseEvent) =>
            openContextMenu(event, {
                path: props.path,
                interceptItems(items) {
                    if (props.depth == 0) {
                        items = items.filter(
                            (item: IContextMenuItem) =>
                                !_.includes(['update-name', 'remove'], item.name)
                        )
                    }
                    return items
                }
            })

        watch(
            () => props.items,
            (oldValue, newValue) => {
                if (!(_.isArray(oldValue) && _.isArray(newValue))) {
                    return
                }
                if (newValue.length !== oldValue.length) {
                    slideRef.value = true
                }
            }
        )
        return () =>
            props.depth >= 0 &&
            props.depth <= props.maxDepth && (
                <div class="diary-file">
                    <div
                        class="diary-file__content"
                        onDblclick={onDblClick}
                        onClick={() => (slideRef.value = !slideRef.value)}
                        onMouseup={onMouseup}
                        // v-ripple={!isRenaming.value}
                    >
                        <div
                            class="diary-file__content-item flex items-center text-truncate"
                            draggable={!renameRef.value}
                            onDragenter={onPrevent}
                            onDragover={onPrevent}
                            onDragstart={onDragstart}
                            onDrop={onDrop}
                        >
                            {_.times(props.depth + 1, (i) => (
                                <i
                                    class={
                                        slideRef.value == true
                                            ? 'mdi mdi-chevron-down'
                                            : 'mdi mdi-chevron-right'
                                    }
                                    style={{
                                        visibility:
                                            isDir.value == true && props.depth == i
                                                ? 'visible'
                                                : 'hidden'
                                    }}
                                />
                            ))}
                            {isDir.value == true ? (
                                <i class="mdi mdi-folder" />
                            ) : (
                                <i class="mdi mdi-file-document-outline" />
                            )}
                            {renameRef.value ? (
                                <diary-text-field path={props.path} onUpdate={updateRename} />
                            ) : (
                                <p class="text-title">{printTitle.value}</p>
                            )}
                        </div>
                    </div>
                    {_.isArray(getItems.value) &&
                        getItems.value.length > 0 &&
                        slideRef.value &&
                        getItems.value.map((item) => (
                            <diary-file {...item} depth={props.depth + 1} />
                        ))}
                </div>
            )
    }
})
