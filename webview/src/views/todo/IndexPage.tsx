import _ from 'lodash'
import {
    defineComponent,
    computed,
    ref,
    unref,
    inject,
    type ComponentPublicInstance,
    onMounted,
    Teleport,
    reactive
} from 'vue'
import { useAppStore } from '@/stores/app'
import { useTodoStore } from '@/stores/todo'
import { useApp } from '@/composables/useApp'
import ModalDialog from '@/components/ui/ModalDialog'
import TextField from '@/components/form/TextField'
import TodoCard from '@/components/todo/TodoCard'
import TodoForm from '@/components/todo/TodoForm'
import '@/views/todo/IndexPage.scoped.scss'
interface TodoPageState {
    form: boolean
    formProps: ITodo | null
    keyword: string
    cards: { value: number; label: string }[]
}
export default defineComponent({
    name: 'TodoPage',
    components: {
        ModalDialog,
        TextField,
        TodoCard,
        TodoForm
    },
    setup() {
        const $toast = inject('toast') as IToastPlugin
        const appStore = useAppStore()
        const todoStore = useTodoStore()
        const { scss } = useApp()
        const state = reactive<TodoPageState>({
            form: false,
            formProps: null,
            keyword: '',
            cards: [
                {
                    value: 0,
                    label: '해야할일'
                },
                {
                    value: 1,
                    label: '진행중'
                },
                {
                    value: 2,
                    label: '완료'
                },
                {
                    value: 3,
                    label: '보류'
                }
            ]
        })
        const contentRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
        const filterTodosByStatus = computed(() => {
            let todoMap = []
            try {
                const todos = unref(todoStore.getTodos)
                todoMap = state.cards.reduce((acc: any, s: ITodoStatus) => {
                    let items = [] as ITodo[]
                    if (todos && todos.length > 0) {
                        items = todos.filter((todo: ITodo) => {
                            if (todo.status !== s.value) {
                                return false
                            }
                            // 만약 검색 키워드가 있다면
                            if (state.keyword) {
                                return _.find(
                                    todo,
                                    (v: keyof ITodo, k: string) =>
                                        k !== 'id' && _.isString(v) && v.includes(state.keyword)
                                )
                                    ? true
                                    : false
                            }
                            return true
                        })
                    }
                    acc.push({
                        ...s,
                        items
                    })
                    return acc
                }, [])
            } catch (e) {
                console.error(e)
            }
            return todoMap
        })
        const toggleForm = (value: boolean, props?: ITodo) => {
            state.form = value
            if (value && props) {
                state.formProps = props
            } else if (value == false) {
                state.formProps = null
            }
        }
        const onScrollX = (event: WheelEvent) => {
            const content = unref(contentRef) as HTMLElement
            if (_.isUndefined(content)) {
                return
            }
            content.scrollLeft += event.deltaY * 2
        }
        const onRefresh = () => todoStore.loadTodos().catch((e) => e)
        const onBeforeRemove = ({ title, id }: { title: string; id: string }) => {
            appStore.toggleModal(true, {
                message: `${title} 카드를 제거하시겠습니까 ?`,
                ok() {
                    todoStore
                        .removeTodo(id)
                        .then(() => {
                            $toast.success('정상적으로 제거되었습니다.')
                            appStore.toggleModal(false)
                        })
                        .catch((e) => $toast.error(e))
                        .finally(() => todoStore.loadTodos().catch((e) => e))
                }
            })
        }
        // 메뉴창 열기
        const onMenu = (
            event: MouseEvent,
            {
                type = 'container',
                payload = null
            }: {
                type?: 'container' | 'card'
                payload: any
            }
        ) => {
            event.stopPropagation()
            if (event.button != 2) {
                return
            }
            let items = [
                {
                    name: 'refresh',
                    desc: '새로고침',
                    shortcut: 'R',
                    icon: 'mdi:mdi-refresh',
                    color: scss('--dark-color'),
                    cb() {
                        onRefresh()
                        appStore.toggleMenu(false)
                    }
                },
                {
                    name: 'add-todo',
                    desc: '카드생성',
                    shortcut: 'N',
                    icon: 'mdi:mdi-file-edit-outline',
                    color: scss('--dark-color'),
                    cb() {
                        toggleForm(true)
                        appStore.toggleMenu(false)
                    }
                }
            ]
            if (type == 'card') {
                items = [
                    ...items,
                    {
                        name: 'edit-todo',
                        desc: '카드편집',
                        shortcut: 'E',
                        icon: 'mdi:mdi-file-edit-outline',
                        color: scss('--dark-color'),
                        cb() {}
                    },
                    {
                        name: 'remove-todo',
                        desc: '카드삭제',
                        shortcut: 'D',
                        icon: 'mdi:mdi-trash-can-outline',
                        color: scss('--dark-color'),
                        cb() {
                            onBeforeRemove(payload)
                            appStore.toggleMenu(false)
                        }
                    }
                ]
            }
            appStore.toggleMenu(true, {
                pageX: event.pageX,
                pageY: event.pageY,
                items
            })
        }
        const onPrevent = (event: Event) => event.preventDefault()
        // 취소하기
        const onCancel = () => {
            onRefresh()
            toggleForm(false)
        }
        const onSubmit = async (todo: ITodo) => {
            if (await todoStore.saveTodo(todo)) {
                $toast.success('정상적으로 등록 및 편집되었습니다.')
                onCancel()
            }
        }
        const onDragstart = (event: DragEvent, todo: ITodo) => {
            if (!(event && event.dataTransfer)) {
                return false
            }
            event.dataTransfer.setData('dragstart-todo', JSON.stringify(todo))
        }
        const onDrop = async (event: DragEvent, status: number) => {
            if (!(event && event.dataTransfer)) {
                return
            }
            let todoJSON = event.dataTransfer.getData('dragstart-todo')
            if (_.isEmpty(todoJSON)) {
                return
            }
            const todo = JSON.parse(todoJSON) as ITodo
            // 이동 대상의 상태로 변환해 준다.
            todo.status = status
            if (await todoStore.saveTodo(todo)) {
                onRefresh()
            }
        }
        onMounted(() => {
            onRefresh()
        })
        return () => (
            <div class="todo-page">
                <Teleport to="body">
                    <modal-dialog
                        title={
                            state.formProps && state.formProps.title ? state.formProps.title : null
                        }
                        modelValue={state.form}
                        onUpdate:modelValue={toggleForm}
                        persistent
                        hide-actions
                        max-width="50vw"
                    >
                        <todo-form {...state.formProps} onSubmit={onSubmit} onCancel={onCancel} />
                    </modal-dialog>
                </Teleport>
                <div class="todo-page__header flex justify-between items-center">
                    <div class="flex items-center">
                        <button type="button" onClick={() => toggleForm(true)}>
                            <i class="mdi mdi-flag-variant" />
                        </button>
                        <h3 class="text-title">해야 할 일</h3>
                    </div>
                    <div class="flex items-center gap-2">
                        <text-field v-model={state.keyword} placeholder="검색하기" />
                        <button type="button" onClick={onRefresh}>
                            <i class="mdi mdi-refresh" />
                            <span class="tooltip tooltip-bottom">새로고침</span>
                        </button>
                    </div>
                </div>
                <div
                    ref={contentRef}
                    class="todo-page__content flex justify-start items-center gap-4"
                    onWheel={onScrollX}
                >
                    {filterTodosByStatus.value.map((todos: any) => (
                        <div
                            class="todo-page__content-item"
                            onMouseup={(event: MouseEvent) => onMenu(event, { payload: todos })}
                            onDragenter={onPrevent}
                            onDragover={onPrevent}
                            onDrop={(event: DragEvent) => onDrop(event, todos.value)}
                        >
                            <div class="todo-page__content-item-header flex justify-between items-center">
                                <b class="text-title">{todos.label}</b>
                                <b class="text-title">{todos.items.length}</b>
                            </div>
                            <div class="flex flex-col justify-center items-center p-2 gap-2">
                                {todos.items.map((todo: ITodo) => (
                                    <todo-card
                                        {...todo}
                                        class="todo-card"
                                        onClick={() => toggleForm(true, todo)}
                                        onMouseup={(event: MouseEvent) =>
                                            onMenu(event, {
                                                type: 'card',
                                                payload: todo
                                            })
                                        }
                                        onRemove={onBeforeRemove}
                                        draggable
                                        onDragenter={onPrevent}
                                        onDragover={onPrevent}
                                        onDragstart={(event: DragEvent) => onDragstart(event, todo)}
                                        onWheel={(event: WheelEvent) => event.stopPropagation()}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
})
