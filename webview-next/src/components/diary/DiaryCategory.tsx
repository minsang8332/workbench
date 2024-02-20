import _ from 'lodash'
import { computed, defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import '@/components/diary/DiaryCategory.scoped.scss'
import { useAppStore } from '@/stores/app'
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
        const appStore = useAppStore()
        const visible = ref<boolean>(false)
        const toggleVisible = () => {
            visible.value = !visible.value
        }
        const isInputPath = computed(() => {
            // const targetPath = this.$app.getUpdatePath()
            // return targetPath && this.path == targetPath
            return false
        })
        const onDbClick = () => {
            /*
            const { path, isDir } = this
            if (!path) {
                return
            }
            if (isDir) {
                return
            }
            this.$router
                .replace({ name: 'markdown-editor', params: { path } })
                .catch((e) => e)
            */
        }
        const onMouseUp = (event: MouseEvent) => {
            console.log('on-mouse-up', event.button)
        }
        /*
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
        */
        return () =>
            props.depth >= 0 &&
            props.depth <= props.maxDepth && (
                <v-card class="diary-category" flat transparent>
                    {
                        <v-row
                            v-ripple={!isInputPath.value}
                            ondbclick={onDbClick}
                            onclick={toggleVisible}
                            mouseup={onMouseUp}
                            no-gutters
                        >
                            <v-col>
                                <v-row draggable={!isInputPath.value} no-gutters>
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
    methods: {,
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
        onDragstart(event, path) {
            if (!(event && event.dataTransfer && path)) {
                return
            }
            event.dataTransfer.setData('path', path)
        },
        async onDrop(event) {
            if (!(event && event.dataTransfer)) {
                return
            }
            try {
                const dest = this.path
                const target = event.dataTransfer.getData('path')
                if (!(target && target != dest)) {
                    return
                }
                const { moved } = await this.moveMarkdown({ target, dest })
                // 현재 작성중인 문서인 경우
                if (this.$route.params.path == target) {
                    this.$router
                        .replace({
                            name: 'markdown-editor',
                            params: { path: moved },
                        })
                        .catch((e) => e)
                }
            } catch (e) {
                this.$toast.error(e)
            }
        },
    },
}
*/
