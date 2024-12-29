import _ from 'lodash'
import {
    defineComponent,
    ref,
    unref,
    reactive,
    computed,
    watch,
    nextTick,
    inject,
    onBeforeMount
} from 'vue'
import type { ComponentPublicInstance, PropType } from 'vue'
import { onBeforeRouteUpdate , onBeforeRouteLeave, type NavigationGuardNext } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import DiaryPreview from '@/components/diary/DiaryPreview'
import DiaryDrawer from '@/components/diary/DiaryDrawer'
import '@/views/DiaryEditorPage.scoped.scss'
export default defineComponent({
    name: 'DiaryEditorPage',
    components: {
        DiaryPreview,
        DiaryDrawer,
    },
    props: {
        path: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props) {
        const state = reactive({
            resizable: false,
            text: '',
            updatedText: '',
            widths: {
                editor: 0,
                preview: 0
            },
            tabSize: 4
        })
        const $toast = inject('toast') as IToastPlugin
        const router = useRouter()
        const appStore = useAppStore()
        const diaryStore = useDiaryStore()
        const containerRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
        const printFilePath = computed(() => {
            let path: string | string[] = props.path
            if (path) {
                path = path.split('/')
                return _.last(path)
            }
            return path
        })
        const edited = computed(() => {
            return state.text !== state.updatedText
        })
        const onKeyDown = (event: KeyboardEvent) => {
            // ctrl + s 는 저장
            if (event.key === 's' && event.ctrlKey
            ||  event.key === 's' && event.metaKey
            ) {
                return onSave()
            }
            // ctrl + a 는 전체 포커스
            if (event.key === 'a' && event.ctrlKey
            ||  event.key === 'a' && event.metaKey
            ) {
                event.preventDefault()
                const el = event.target as HTMLTextAreaElement
                el.select()
                el.focus()
            }
            //
            // 탭 누르면 띄워쓰기
            if (event.key == 'Tab') {
                event.preventDefault()
                const el = event.target as HTMLTextAreaElement
                const start = el.selectionStart
                const end = el.selectionEnd
                state.updatedText = state.updatedText.slice(0, start) + '\t' + state.updatedText.slice(end)
                nextTick(() => {
                    el.selectionStart = start + 1
                    el.selectionEnd = start + 1
                })
            }
        }
        const onMoveBack = () => {
            if (window.history && window.history.length > 2) {
                router.back()
                return
            }
            router.replace({ name: 'diary' }).catch((e) => e)
        }
        const onMouseUp = () => {
            state.resizable = false
        }
        const onMouseDown = () => {
            state.resizable = true
        }
        const onResize = (event: Event | null, reset = false) => {
            // reset 은 무조건 통과
            if (reset) {
                nextTick(() => {
                    const unrefed = unref(containerRef.value)
                    if (!(unrefed && unrefed.$el)) {
                        return
                    }
                    const domRect = unrefed.$el.getBoundingClientRect()
                    state.widths.editor = domRect.width / 2
                    state.widths.preview = domRect.width / 2
                })
                return
            }
            if (state.resizable && event) {
                nextTick(() => {
                    const unrefed = unref(containerRef.value)
                    if (!(unrefed && unrefed.$el)) {
                        return
                    }
                    const domRect = unrefed.$el.getBoundingClientRect()
                    const { x } = event as MouseEvent
                    const width = x - domRect.left
                    state.widths.editor = x - domRect.left
                    state.widths.preview = domRect.width - width - 4
                })
            }
        }
        const onReset = () => {
            state.text = ''
        }
        const onLoad = () => {
            onReset()
            diaryStore
                .readDiary({ target: props.path })
                .then(response => {
                    if (response) {
                        state.text = response.text
                    }
                })
                .catch((e) => {
                    $toast.error(e)
                    onReset()
                })
        }
        const onSave = () => {
            const base = _.last(props.path.split('/'))
            const filename = _.first(base?.split('.'))
            const ext = _.last(base?.split('.'))
            diaryStore
                .saveDiary({ target: props.path, filename, ext, text: state.updatedText })
                .then(() => {
                    $toast.success(`${base} 파일에 작성되었습니다.`)
                    onLoad()
                })
                .catch((e) => $toast.error(e))
        }
        const preventRoute = (next: NavigationGuardNext) => {
            if (unref(edited)) {
                $toast.error(new Error('문서에 변경사항이 있습니다. 저장 한 후 다시 시도해 주세요.'))
                return next(false)
            }
            next()
        }
        const isMarkdown = computed(() => {
            const base = _.last(props.path.split('/'))
            const ext = _.last(base?.split('.'))
            return _.includes(['md'], ext)
        })
        watch(
            () => props.path,
            (newValue) => {
                if (newValue) {
                    onLoad()
                }
            }
        )
        watch(
            () => state.text,
            (newValue) => {
                state.updatedText = newValue
            }
        )
        watch(
            edited,
            (newValue) => diaryStore.updateEdited(newValue)
        )
        onBeforeMount(() => {
            diaryStore.updateEdited(false)
            onLoad()
            if (unref(isMarkdown)) {
                onResize(null, true)
            }
        })
        onBeforeRouteLeave((to, from, next) => preventRoute(next))
        onBeforeRouteUpdate((to, from, next) => preventRoute(next))
        return () => (
            <v-container
            ref={containerRef}
            class="diary-editor-page pa-0"
            fluid
            onMousemove={onResize}
            onMouseup={onMouseUp}
            >
                <diary-drawer />
                <v-card class="diary-editor-page__card" flat tile outlined>
                    <v-row class="diary-editor-page__card-header text-truncate" no-gutters>
                        <v-col class="d-flex align-center">
                            <v-btn
                                variant="text"
                                size="large"
                                onClick={diaryStore.toggleDrawer}
                            >
                                <v-icon class="ico-menu">mdi:mdi-menu</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">문서 탐색</p>
                                </v-tooltip>
                            </v-btn>
                            <v-badge
                                title={unref(printFilePath)}
                                color={unref(edited) ? 'red' : 'transparent'}
                                inline
                                dot
                            >
                                <h3 class="text-title d2-coding mr-1">{unref(printFilePath)}</h3>
                            </v-badge>
                        </v-col>
                        <v-col class="d-flex align-center justify-end">
                            <v-btn
                                color={appStore.scss('--dark-color')}
                                variant="text"
                                size="large"
                                tile
                                depressed
                                onClick={onMoveBack}
                            >
                                <v-icon>mdi:mdi-arrow-left</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">뒤로가기</p>
                                </v-tooltip>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider color={appStore.scss('--theme-color-1')} />
                    <v-row class="diary-editor-page__card-editor" no-gutters>
                        <v-col class="d-flex">
                            <textarea
                                v-model={state.updatedText}
                                class="d2coding pa-2"
                                style={{
                                    width: unref(isMarkdown) ? state.widths.editor + 'px' : '100%'
                                }}
                                onKeydown={onKeyDown}
                            />
                            {
                                unref(isMarkdown) && <>
                                    <div class="resizer" onMousedown={onMouseDown} />
                                    <diary-preview
                                        value={state.updatedText}
                                        style={{
                                            width: state.widths.preview + 'px'
                                        }}
                                    />
                                </>
                            }
                        </v-col>
                    </v-row>
                    <v-divider color={appStore.scss('--theme-color-1')} />
                    <v-row class="diary-editor-page__card-actions text-truncate px-1" no-gutters>
                        <v-col class="align-self-center">
                            <v-btn
                                color={appStore.scss('--dark-color')}
                                class="btn-save pulsing pa-0"
                                variant="text"
                                tile
                                block
                                depressed
                                onClick={onSave}
                            >
                                <v-icon class="text-white">mdi:mdi-send</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">파일을 저장해 주세요.</p>
                                </v-tooltip>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-container>
        )
    }
})
