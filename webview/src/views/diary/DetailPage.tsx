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
import { onBeforeRouteUpdate, onBeforeRouteLeave, type NavigationGuardNext } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import MarkdownPreview from '@/components/ui/MarkdownPreview'
import '@/views/diary/DetailPage.scoped.scss'
import { useApp } from '@/composables/useApp'
export default defineComponent({
    name: 'DiaryDetailPage',
    components: {
        MarkdownPreview
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
        const { getDrawerWidth, getLayoutWidth } = useApp()
        const pageRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
        const printFilePath = computed(() => {
            let path: string | string[] = props.path
            if (path) {
                path = path.split('/')
                return _.last(path)
            }
            return path
        })
        const disabledRef = computed(() => {
            return state.text !== state.updatedText
        })
        const isMarkdown = computed(() => {
            const base = _.last(props.path.split('/'))
            const ext = _.last(base?.split('.'))
            return _.includes(['md'], ext)
        })
        const onKeyDown = (event: KeyboardEvent) => {
            // ctrl + s 는 저장
            if ((event.key === 's' && event.ctrlKey) || (event.key === 's' && event.metaKey)) {
                return onSave()
            }
            // ctrl + a 는 전체 포커스
            if ((event.key === 'a' && event.ctrlKey) || (event.key === 'a' && event.metaKey)) {
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
                state.updatedText =
                    state.updatedText.slice(0, start) + '\t' + state.updatedText.slice(end)
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
        const onResize = (event: Event | null, init = false) => {
            const el = unref(pageRef.value) as HTMLElement
            if (!el) {
                return
            }
            const layoutWidth = getLayoutWidth()
            const drawerWidth = getDrawerWidth()
            const resizerWidth = 4
            const paddingWidth = 4
            if (init) {
                const width = (layoutWidth - drawerWidth - resizerWidth - paddingWidth) / 2
                state.widths.editor = width
                state.widths.preview = width
            } else if (state.resizable && event) {
                const x = (event as MouseEvent).x
                const editorWidth = x - drawerWidth - resizerWidth - paddingWidth
                const previewWidth =
                    layoutWidth - drawerWidth - editorWidth - resizerWidth - paddingWidth
                state.widths.editor = editorWidth
                state.widths.preview = previewWidth
            }
        }
        const onReset = () => {
            state.text = ''
        }
        const onLoad = () => {
            onReset()
            diaryStore.loadDiaries()
            diaryStore
                .readDiary({ filepath: props.path })
                .then((text) => {
                    state.text = text
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
                .saveDiary({ filepath: props.path, filename, ext, text: state.updatedText })
                .then(() => {
                    $toast.success(`${base} 파일에 작성되었습니다.`)
                    onLoad()
                })
                .catch((e) => $toast.error(e))
        }
        const preventRoute = (next: NavigationGuardNext) => {
            if (unref(disabledRef)) {
                $toast.error(
                    new Error('문서에 변경사항이 있습니다. 저장 한 후 다시 시도해 주세요.')
                )
                return next(false)
            }
            next()
        }
        watch(
            () => props.path,
            (newValue) => {
                if (newValue) {
                    onLoad()
                }
                onResize(null, true)
            }
        )
        watch(
            () => state.text,
            (newValue) => {
                state.updatedText = newValue
            }
        )
        watch(disabledRef, (newValue) => diaryStore.updateEdited(newValue))
        watch(
            () => appStore.getDrawer,
            (value) => {
                nextTick(() => onResize(null, true))
            }
        )
        onMounted(() => {
            diaryStore.updateEdited(false)
            onLoad()
            // 현재 문서가 마크다운 이라면 프리뷰 화면 사이즈를 배분한다.
            if (unref(isMarkdown)) {
                onResize(null, true)
            }
        })
        onBeforeRouteLeave((to, from, next) => preventRoute(next))
        onBeforeRouteUpdate((to, from, next) => preventRoute(next))
        return () => (
            <article
                ref={pageRef}
                class="detail-page flex flex-col gap-1 w-full"
                onMousemove={onResize}
                onMouseup={onMouseUp}
            >
                <div class="detail-page__header flex justify-between items-center w-full">
                    <div class="flex items-center gap-2">
                        <div class="flex items-center">
                            <button
                                type="button"
                                class="btn-drawer flex justify-center items-center"
                                onClick={() => appStore.toggleDrawer()}
                            >
                                <i class="mdi mdi-menu" />
                                <span class="tooltip tooltip-bottom">문서 탐색</span>
                            </button>
                            <h3 class="text-title">{printFilePath.value}</h3>
                        </div>
                        <div class="editing" style={{ opacity: unref(disabledRef) ? 1 : 0 }} />
                    </div>
                    <div class="flex items-center">
                        <button
                            type="button"
                            class="btn-back flex justify-center items-center"
                            onClick={onMoveBack}
                        >
                            <i class="mdi mdi-arrow-left" />
                            <span class="tooltip tooltip-bottom">뒤로 가기</span>
                        </button>
                    </div>
                </div>

                <div class="detail-page__content flex">
                    <textarea
                        v-model={state.updatedText}
                        class="d2coding pa-2"
                        style={{
                            width: unref(isMarkdown) ? state.widths.editor + 'px' : '100%'
                        }}
                        onKeydown={onKeyDown}
                    />
                    <div class="resizer" onMousedown={onMouseDown} />
                    {unref(isMarkdown) && (
                        <div
                            class="preview"
                            style={{
                                width: state.widths.preview + 'px'
                            }}
                        >
                            <markdown-preview value={state.updatedText} />
                        </div>
                    )}
                </div>
                <div class="detail-page__actions flex items-center w-full">
                    <button type="button" class="btn-submit block h-full w-full" onClick={onSave}>
                        <i class="mdi mdi-send" />
                        <span class="tooltip">문서를 저장합니다</span>
                    </button>
                </div>
            </article>
        )
    }
})
