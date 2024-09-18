import _, { countBy } from 'lodash'
import { computed, defineComponent, ref, watch, inject, unref } from 'vue'
import type { PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import DiaryInputPath from '@/components/diary//DiaryInputPath'
import '@/components/diary/DiaryTree.scoped.scss'
export default defineComponent({
    name: 'DiaryTree',
    components: {
        DiaryInputPath
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
            type: [Object, Array, null, undefined] as PropType<
                object | object[] | null | undefined
            >,
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
        const appStore = useAppStore()
        const diaryStore = useDiaryStore()
        const visible = ref<boolean>(true)
        const editable = ref<boolean>(false)
        const toggleVisible = () => {
            visible.value = !visible.value
        }
        const isRenaming = computed(() => {
            return unref(editable)
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
        // 메뉴창 열기
        const onMenu = (event: MouseEvent) => {
            if (event.button != 2) {
                return
            }
            const items = [
                {
                    name: 'refresh',
                    desc: '새로고침',
                    shortcut: 'R',
                    icon: 'mdi:mdi-refresh',
                    color: appStore.scss('--dark-color'),
                    cb() {
                        diaryStore
                            .loadDiaries()
                            .catch((e) => console.error(e))
                            .finally(() => appStore.toggleMenu(false))
                    }
                },
                {
                    name: 'add-folder',
                    desc: '새 폴더',
                    shortcut: 'N',
                    icon: 'fa-solid fa-folder',
                    color: appStore.scss('--folder-color'),
                    cb() {
                        diaryStore
                            .mkdirDiary({
                                target: props.path
                            })
                            .then(({ writed }) => $toast.success(`${writed} 생성 되었습니다.`))
                            .catch((e) => $toast.error(e))
                            .finally(() => appStore.toggleMenu(false))
                    }
                },
                {
                    name: 'add',
                    desc: '새 문서',
                    shortcut: 'N',
                    icon: 'mdi:mdi-file-document-outline',
                    color: appStore.scss('--dark-color'),
                    cb() {
                        diaryStore
                            .saveDiary({
                                target: props.path
                            })
                            .then(({ writed }) => $toast.success(`${writed} 생성 되었습니다.`))
                            .catch((e) => $toast.error(e))
                            .finally(() => appStore.toggleMenu(false))
                    }
                },
                {
                    name: 'update-name',
                    desc: '이름 바꾸기',
                    shortcut: 'M',
                    icon: 'mdi:mdi-pencil-box-outline',
                    color: appStore.scss('--dark-color'),
                    cb() {
                        editable.value = true
                        appStore.toggleMenu(false)
                    }
                },
                {
                    name: 'remove',
                    desc: '삭제',
                    shortcut: 'D',
                    icon: 'mdi:mdi-trash-can-outline',
                    color: appStore.scss('--dark-color'),
                    cb() {
                        diaryStore
                            .rmDiary({ target: props.path })
                            .then(({ removed }) => {
                                $toast.success(`${removed} 삭제되었습니다.`)
                                router
                                    .replace({ name: 'diary' })
                                    .catch((e) => e)
                                    .finally(() => appStore.toggleMenu(false))
                            })
                            .catch((e) => $toast.error(e))
                    }
                }
            ]
            appStore.toggleMenu(true, {
                pageX: event.pageX,
                pageY: event.pageY,
                items
            })
        }
        const onPrevent = (event: DragEvent) => {
            event.preventDefault()
        }
        const onDragStart = (event: DragEvent, target: string = props.path) => {
            if (!(event && event.dataTransfer)) {
                return
            }
            if (!target) {
                return
            }
            event.dataTransfer.setData('target', target)
        }
        const onDrop = async (event: DragEvent) => {
            if (!(event && event.dataTransfer)) {
                return
            }
            try {
                const target = event.dataTransfer.getData('target')
                const dest = props.path
                if (!(target && target != dest)) {
                    return
                }
                const { moved } = await diaryStore.mvDiary({ target, dest })
                // 현재 작성중인 문서인 경우
                if (route.params.path == target) {
                    router
                        .replace({
                            name: 'diary-editor',
                            params: { path: moved }
                        })
                        .catch((e) => e)
                }
            } catch (e) {
                $toast.error(e as Error)
            }
        }
        const toggleEditable = (toggle = false) => {
            editable.value = toggle
        }
        watch(
            () => props.items,
            (oldValue, newValue) => {
                if (!(_.isArray(oldValue) && _.isArray(newValue))) {
                    return
                }
                if (newValue.length !== oldValue.length) {
                    visible.value = true
                }
            }
        )
        return () =>
            props.depth >= 0 &&
            props.depth <= props.maxDepth && (
                <v-card class="diary-tree" flat transparent>
                    {
                        <v-row
                            v-ripple={!unref(isRenaming)}
                            onDblclick={onDblClick}
                            onClick={toggleVisible}
                            onMouseup={onMenu}
                            no-gutters
                        >
                            <v-col>
                                <v-row
                                    draggable={!unref(isRenaming)}
                                    onDragenter={onPrevent}
                                    onDragover={onPrevent}
                                    onDragstart={onDragStart}
                                    onDrop={onDrop}
                                    no-gutters
                                >
                                    {props.depth > 0 && (
                                        <v-col class="text-right" cols={props.depth}>
                                            {props.isDir && (
                                                <v-icon
                                                    color={appStore.scss('--dark-color')}
                                                    size="small"
                                                    icon="mdi:mdi-chevron-right"
                                                />
                                            )}
                                        </v-col>
                                    )}
                                    <v-col class="d-flex align-center text-truncate">
                                        {props.isDir ? (
                                            <v-icon
                                                class="mr-1"
                                                size="small"
                                                color={appStore.scss('--folder-color')}
                                                icon="fa-solid fa-folder"
                                            />
                                        ) : (
                                            <v-icon
                                                class="mr-1"
                                                size="small"
                                                color={appStore.scss('--dark-color')}
                                                icon="mdi:mdi-file-document-outline"
                                            />
                                        )}
                                        {unref(isRenaming) ? (
                                            <diary-input-path
                                                path={props.path}
                                                onToggle={toggleEditable}
                                            />
                                        ) : (
                                            <b class="diary-tree__title">{props.title}</b>
                                        )}
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    }
                    {_.isArray(props.items) && props.items.length > 0 && visible.value && (
                        <v-row no-gutters>
                            <v-col>
                                {props.items.map((item) => (
                                    <diary-tree {...item} depth={props.depth + 1} />
                                ))}
                            </v-col>
                        </v-row>
                    )}
                </v-card>
            )
    }
})
