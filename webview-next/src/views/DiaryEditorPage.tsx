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
    onMounted
} from 'vue'
import type { ComponentPublicInstance, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import DiaryPreview from '@/components/diary/DiaryPreview'
import '@/views/DiaryEditorPage.scoped.scss'
export default defineComponent({
    name: 'DiaryEditorPage',
    components: {
        DiaryPreview
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
            previewText: '',
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
        const isUpdated = computed(() => {
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
                let indent = ''
                for (let i=0; i<state.tabSize; i++) {
                    indent += ' '
                }
                nextTick(() => {
                    state.updatedText += indent
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
            state.updatedText = ''
        }
        const onLoad = () => {
            onReset()
            diaryStore
                .readDiaryWithPreview({ target: props.path })
                .then((response) => {
                    if (response) {
                        state.text = response.text
                        state.previewText = response.preview
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
        onMounted(() => {
            onLoad()
            onResize(null, true)
        })
        return () => (
            <v-container
                ref={containerRef}
                class="diary-editor-page pa-0"
                fluid
                onMousemove={onResize}
                onMouseup={onMouseUp}
            >
                <v-card class="dep-card fill-height" flat tile outlined>
                    <v-row class="dep-row-header text-truncate" no-gutters>
                        <v-col class="d-flex align-center">
                            <v-btn
                                variant="text"
                                onClick={diaryStore.toggleDrawer}
                            >
                                <v-icon class="ico-menu">fa-solid fa-bars</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">문서 탐색</p>
                                </v-tooltip>
                            </v-btn>
                            <v-badge
                                title={unref(printFilePath)}
                                color={unref(isUpdated) ? 'red' : 'transparent'}
                                inline
                                dot
                            >
                                <h3 class="mr-1">{unref(printFilePath)}</h3>
                            </v-badge>
                        </v-col>
                        <v-col class="d-flex align-center justify-end">
                            <v-btn
                                color={appStore.scss('--dark-color')}
                                class="pa-0"
                                variant="text"
                                tile
                                depressed
                                onclick={onMoveBack}
                            >
                                <v-icon>mdi:mdi-arrow-left</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">뒤로가기</p>
                                </v-tooltip>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider color={appStore.scss('--theme-color-1')} />
                    <v-row class="dep-row-main pa-0" no-gutters>
                        <v-col class="d-flex fill-height">
                            <textarea
                                v-model={state.updatedText}
                                class="dep-editor d2coding pa-2"
                                style={{
                                    width: state.widths.editor + 'px'
                                }}
                                onKeydown={onKeyDown}
                            />
                            <div class="dep-resizer" onMousedown={onMouseDown}>
                                <v-btn
                                    class="dep-btn-resizer"
                                    variant="text"
                                    size="large"
                                    rounded
                                    color={appStore.scss('--theme-color-1')}
                                >
                                    <v-icon>fa-solid fa-compress</v-icon>
                                </v-btn>
                            </div>
                            <diary-preview
                                preview={state.previewText}
                                style={{
                                    width: state.widths.preview + 'px'
                                }}
                            />
                        </v-col>
                    </v-row>
                    <v-divider color={appStore.scss('--theme-color-1')} />
                    <v-row class="dep-row-footer text-truncate px-1" no-gutters>
                        <v-col class="align-self-center">
                            <v-btn
                                color={appStore.scss('--dark-color')}
                                class="dep-btn-save pulsing pa-0"
                                variant="text"
                                tile
                                block
                                depressed
                                onclick={onSave}
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
