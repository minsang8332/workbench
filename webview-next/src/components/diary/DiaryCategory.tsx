import _ from 'lodash'
import { computed, defineComponent, ref, watch, inject } from 'vue'
import type { PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import '@/components/diary/DiaryCategory.scoped.scss'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
export default defineComponent({
    name: 'DiaryCategory',
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
        const toggleVisible = () => {
            visible.value = !visible.value
        }
        const isUpdate = computed(() => {
            return appStore.getIsInputPath && props.path == appStore.getIsInputPath
        })
        const onDbClick = () => {
            if (!props.path) {
                return
            }
            if (props.isDir) {
                return
            }
            router.replace({ name: 'diary', params: { path: props.path } }).catch((e) => e)
        }
        // 메뉴창 열기
        const onMouseUp = (event: MouseEvent) => {
            console.log('on-mouse-up', event.button)
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
                            name: 'diary',
                            params: { path: moved }
                        })
                        .catch((e) => e)
                }
            } catch (e) {
                $toast.error(e as Error)
            }
        }
        return () =>
            props.depth >= 0 &&
            props.depth <= props.maxDepth && (
                <v-card class="diary-category" flat transparent>
                    {
                        <v-row
                            v-ripple={!isUpdate.value}
                            ondbclick={onDbClick}
                            onclick={toggleVisible}
                            mouseup={onMouseUp}
                            no-gutters
                        >
                            <v-col>
                                <v-row
                                    draggable={!isUpdate.value}
                                    ondragenter={onPrevent}
                                    ondragover={onPrevent}
                                    ondragstart={onDragStart}
                                    ondrop={onDrop}
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
                                        <b class="dc-text-title">{props.title}</b>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    }
                    {_.isArray(props.items) && props.items.length > 0 && visible.value && (
                        <v-row no-gutters>
                            <v-col>
                                {props.items.map((item) => (
                                    <diary-category {...item} depth={props.depth + 1} />
                                ))}
                            </v-col>
                        </v-row>
                    )}
                </v-card>
            )
    }
})
/*
        // 우측 마우스 클릭시 메뉴 모달
        onRightClick(event) {
            const { path, isDir } = this
            this.$app.showMenu({
                pageX: event.pageX,
                pageY: event.pageY,
                path,
                isDir,
            })
        },

*/
