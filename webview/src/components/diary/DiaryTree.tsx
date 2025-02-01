import _ from 'lodash'
import { computed, defineComponent, ref, watch, inject, unref } from 'vue'
import type { PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
import { useApp } from '@/composables/useApp'
import { useDiary } from '@/composables/useDiary'
import type { IDiary } from '@/types/model'
import DiaryNameField from '@/components/diary/DiaryNameField'
import './DiaryTree.scoped.scss'
export interface IDiaryTree extends IDiary {
    title: string
    parent: string
    items: IDiaryTree[]
}
export default defineComponent({
    name: 'DiaryTree',
    components: {
        DiaryNameField
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
            type: Array as PropType<IDiaryTree[]>,
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
        const router = useRouter()
        const route = useRoute()
        const diaryStore = useDiaryStore()
        const { alert } = useApp()
        const { isRenameRef, onRename, onContextMenu } = useDiary()
        const slideRef = ref<boolean>(true)
        const getItems = computed(() => {
            return props.items.sort((a, b) => (b.isDir ? 1 : 0) - (a.isDir ? 1 : 0))
        })
        const onDblClick = () => {
            if (!props.path) {
                return
            }
            if (props.isDir) {
                return
            }
            router.replace({ name: 'diary-editor', params: { path: props.path } }).catch((e) => e)
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
                            name: 'diary-editor',
                            params: { path: filename }
                        })
                        .catch((e) => e)
                }
                await diaryStore.loadDiaries()
            } catch (e) {
                alert.error(e as Error)
            }
        }
        const onMouseup = (event: MouseEvent) =>
            onContextMenu(event, {
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
                <div class="diary-tree">
                    <div
                        class="diary-tree__content"
                        onDblclick={onDblClick}
                        onClick={() => (slideRef.value = !slideRef.value)}
                        onMouseup={onMouseup}
                    >
                        <div
                            class={{
                                'diary-tree__content-item flex items-center text-truncate': true,
                                'diary-tree__content-item--active': route.params.path == props.path
                            }}
                            draggable={!isRenameRef.value}
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
                                            props.isDir && props.depth == i ? 'visible' : 'hidden'
                                    }}
                                />
                            ))}
                            {props.isDir ? (
                                <i class="mdi mdi-folder" />
                            ) : (
                                <i class="mdi mdi-file-document-outline" />
                            )}
                            {isRenameRef.value ? (
                                <diary-name-field
                                    value={props.path}
                                    onChange={(filename: string) => onRename(props.path, filename)}
                                />
                            ) : (
                                <p class="text-title">{props.title}</p>
                            )}
                        </div>
                    </div>
                    {_.isArray(getItems.value) &&
                        getItems.value.length > 0 &&
                        slideRef.value &&
                        getItems.value.map((item) => (
                            <diary-tree {...item} depth={props.depth + 1} />
                        ))}
                </div>
            )
    }
})
