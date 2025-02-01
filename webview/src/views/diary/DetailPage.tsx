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
    onMounted,
    onBeforeUnmount
} from 'vue'
import type { PropType } from 'vue'
import {
    onBeforeRouteUpdate,
    onBeforeRouteLeave,
    type NavigationGuardNext,
    type RouteLocationNormalizedGeneric
} from 'vue-router'
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
            editorText: '',
            widths: {
                editor: 0,
                preview: 0
            },
            tabSize: 4,
            preventRoute: false
        })
        const router = useRouter()
        const appStore = useAppStore()
        const diaryStore = useDiaryStore()
        const { alert, getDrawerWidth, getLayoutWidth } = useApp()
        const pageRef = ref<HTMLElement>()
        const printFilePath = computed(() => {
            let path: string | string[] = props.path
            if (path) {
                path = path.split('/')
                return _.last(path)
            }
            return path
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
                state.editorText =
                    state.editorText.slice(0, start) + '\t' + state.editorText.slice(end)
                nextTick(() => {
                    el.selectionStart = start + 1
                    el.selectionEnd = start + 1
                })
            }
        }
        const onBack = () => {
            if (window.history && window.history.length > 1) {
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
                    alert.error(e)
                    onReset()
                })
        }
        const onSave = () => {
            const base = _.last(props.path.split('/'))
            const filename = _.first(base?.split('.'))
            const ext = _.last(base?.split('.'))
            diaryStore
                .saveDiary({ filepath: props.path, filename, ext, text: state.editorText })
                .then(() => alert.success(`${base} 파일에 작성되었습니다.`))
                .catch((e) => alert.error(e))
                .finally(onLoad)
        }
        const onPreventRoute = async (
            to: RouteLocationNormalizedGeneric,
            next: NavigationGuardNext
        ) => {
            if (diaryStore.isPreventRoute == true) {
                const confirmed: boolean = await new Promise((resolve) =>
                    appStore.toggleModal(true, {
                        title: '변경사항 안내',
                        message: [
                            '문서에 변경사항이 있습니다.',
                            '그래도 편집 화면을 이탈 하시겠습니까 ?'
                        ],
                        ok: () => resolve(true),
                        cancel: () => resolve(false)
                    })
                )
                return next(confirmed)
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
        // 원본이 변경되면 현재 편집 중인 내용을 갱신
        watch(
            () => state.text,
            (newValue) => {
                state.editorText = newValue
                diaryStore.updatePreventRoute(false)
            }
        )
        // 편집본이 변경되면 라우트 이동을 막는다.
        watch(
            () => state.editorText,
            (newValue) => {
                diaryStore.updatePreventRoute(state.text != state.editorText)
            }
        )
        // 드로어가 열리고 닫힐 때 넓이를 계산
        watch(
            () => appStore.getDrawer,
            (value) => {
                nextTick(() => onResize(null, true))
            }
        )
        onMounted(() => {
            onLoad()
            // 현재 문서가 마크다운 이라면 프리뷰 화면 사이즈를 배분한다.
            if (unref(isMarkdown)) {
                onResize(null, true)
            }
        })
        onBeforeUnmount(() => diaryStore.updatePreventRoute(false))
        onBeforeRouteLeave((to, from, next) => onPreventRoute(to, next))
        onBeforeRouteUpdate((to, from, next) => onPreventRoute(to, next))
        return () => (
            <article
                ref={pageRef}
                class="detail-page flex flex-col"
                onMousemove={onResize}
                onMouseup={onMouseUp}
            >
                <div class="detail-page__header flex justify-between items-center w-full">
                    <div class="flex items-center gap-2">
                        <div class="flex items-center gap-1">
                            <button
                                type="button"
                                class="btn-drawer flex justify-center items-center"
                                onClick={() => appStore.toggleDrawer()}
                            >
                                <i class="mdi mdi-menu" />
                                <span class="tooltip tooltip-bottom">문서 탐색</span>
                            </button>
                            <b class="text-title">{printFilePath.value}</b>
                        </div>
                        <div
                            class="prevent-route"
                            style={{ opacity: diaryStore.isPreventRoute ? 1 : 0 }}
                        />
                    </div>
                    <div class="flex items-center">
                        <button
                            type="button"
                            class="btn-back flex justify-center items-center"
                            onClick={onBack}
                        >
                            <i class="mdi mdi-arrow-left" />
                            <span class="tooltip tooltip-bottom">뒤로 가기</span>
                        </button>
                    </div>
                </div>

                <div class="detail-page__content flex">
                    <textarea
                        v-model={state.editorText}
                        class="pa-2"
                        style={{
                            width: unref(isMarkdown) ? state.widths.editor + 'px' : '100%'
                        }}
                        onKeydown={onKeyDown}
                    />
                    {unref(isMarkdown) && (
                        <>
                            <div class="resizer" onMousedown={onMouseDown} />
                            <div
                                class="preview"
                                style={{
                                    width: state.widths.preview + 'px'
                                }}
                            >
                                <markdown-preview value={state.editorText} />
                            </div>
                        </>
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
