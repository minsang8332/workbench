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
import '@/views/DiaryPage.scoped.scss'
export default defineComponent({
    name: 'DiaryPage',
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
            }
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
            if (!(event.key === 's' && event.ctrlKey)) {
                return
            }
            onSave()
        }
        const onMoveBack = () => {
            if (window.history && window.history.length > 2) {
                router.back()
                return
            }
            router.replace({ name: 'dashboard' }).catch((e) => e)
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
                class="diary-page pa-0"
                fluid
                onMousemove={onResize}
                onMouseup={onMouseUp}
            >
                <v-card class="dp-card fill-height" flat tile outlined>
                    <v-row class="dp-row-header text-truncate" no-gutters>
                        <v-col class="d-flex align-center">
                            <v-btn
                                color={appStore.scss('--dark-color')}
                                class="pa-0"
                                variant="text"
                                size="small"
                                tile
                                depressed
                                onclick={onMoveBack}
                            >
                                <v-icon>mdi:mdi-chevron-left</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">뒤로가기</p>
                                </v-tooltip>
                            </v-btn>
                            <v-icon class="mr-1" color={appStore.scss('--dark-color')}>
                                mdi:mdi-file-document-outline
                            </v-icon>
                            <v-badge
                                title={unref(printFilePath)}
                                color={unref(isUpdated) ? 'red' : 'transparent'}
                                inline
                                dot
                            >
                                <b class="dp-text-title mr-1">{unref(printFilePath)}</b>
                            </v-badge>
                        </v-col>
                    </v-row>
                    <v-divider color={appStore.scss('--theme-color-1')} />
                    <v-row class="dp-row-main pa-0" no-gutters>
                        <v-col class="d-flex fill-height">
                            <textarea
                                v-model={state.updatedText}
                                class="dp-editor d2coding pa-2"
                                style={{
                                    width: state.widths.editor + 'px'
                                }}
                                onKeydown={onKeyDown}
                            />
                            <div class="dp-resizer" onMousedown={onMouseDown}>
                                <v-btn
                                    class="dp-btn-resizer"
                                    variant="text"
                                    size="large"
                                    color={appStore.scss('--theme-color-2')}
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
                    <v-row class="dp-row-footer text-truncate px-1" no-gutters>
                        <v-col class="align-self-center">
                            <v-btn
                                color={appStore.scss('--dark-color')}
                                class="dp-btn-save pulsing pa-0"
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
