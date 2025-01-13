import _ from 'lodash'
import { defineComponent, computed, ref, unref, inject, onMounted, Teleport, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { useTodoStore } from '@/stores/todo'
import { useApp } from '@/composables/useApp'
import commonUtil from '@/utils/common'
import ModalDialog from '@/components/ui/ModalDialog'
import TextField from '@/components/form/TextField'
import TodoCard from '@/components/todo/TodoCard'
import TodoForm from '@/components/todo/TodoForm'
import { TODO_STATUS } from '@/costants/model'
import type { ITodo, ITodoSprint } from '@/types/model'
import '@/views/todo/IndexPage.scoped.scss'
interface ITodoCard {
    value: TODO_STATUS
    label: string
}
interface ITodoPageState {
    keyword: string
    cards: ITodoCard[]
    todoForm: {
        modal: boolean
        todo: ITodo | null
        sprints: ITodoSprint[]
    }
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
        const state = reactive<ITodoPageState>({
            keyword: '',
            cards: [
                {
                    value: TODO_STATUS.PREPARE,
                    label: '준비중'
                },
                {
                    value: TODO_STATUS.PROCESS,
                    label: '진행중'
                },
                {
                    value: TODO_STATUS.DONE,
                    label: '완료'
                },
                {
                    value: TODO_STATUS.HOLD,
                    label: '보류'
                }
            ],
            todoForm: {
                modal: false,
                todo: null,
                sprints: []
            }
        })
        const contentRef = ref<HTMLElement>()
        const filterTodosByStatus = computed(() => {
            let todoMap = []
            try {
                const todos = unref(todoStore.getTodos)
                todoMap = state.cards.reduce((acc: any, s: ITodoCard) => {
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
                                    (v: ITodo[keyof ITodo], k: string) =>
                                        k !== 'id' &&
                                        _.isString(v) &&
                                        commonUtil.searchByInitial(v, state.keyword)
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
        const onToggleForm = async (modal: boolean, todo?: ITodo) => {
            if (!_.isBoolean(modal)) {
                return
            }
            if (modal && todo) {
                let sprints = []
                if (!_.isNil(todo.id)) {
                    const response = await todoStore.loadSprint(todo.id)
                    sprints = response.data.sprints
                }
                state.todoForm.todo = todo
                state.todoForm.sprints = sprints
            } else {
                state.todoForm.todo = null
                state.todoForm.sprints = []
            }
            state.todoForm.modal = modal
        }
        const onRefresh = () => todoStore.loadTodos().catch((e) => e)
        const onBeforeDelete = ({ id, title }: { id: string; title: string }) => {
            appStore.toggleModal(true, {
                message: `${title} 카드를 제거하시겠습니까 ?`,
                ok() {
                    todoStore
                        .deleteTodo(id)
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
        const onContextMenu = (
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
                        onToggleForm(true)
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
                            onBeforeDelete(payload)
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
        const onCancelForm = () => {
            onRefresh()
            onToggleForm(false)
        }
        const onSubmitForm = async (payload: ITodo & { sprints?: ITodoSprint[] }) => {
            try {
                const response = await todoStore.saveTodo(payload)
                if (!(response && response.result)) {
                    throw new Error('해야 할 일을 작성 할 수 없습니다.')
                }
                state.todoForm.modal = false
                $toast.success('정상적으로 반영되었습니다.')
            } catch (e) {
                $toast.error(e as Error)
            } finally {
                onRefresh()
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
            onSubmitForm(todo)
        }
        onMounted(() => {
            onRefresh()
        })
        return () => (
            <div class="todo-page flex flex-col">
                <div class="todo-page__header flex justify-between items-center">
                    <div class="flex items-center gap-1">
                        <button type="button" onClick={() => onToggleForm(true)}>
                            <i class="mdi mdi-flag-variant" />
                        </button>
                        <b class="text-title">해야 할 일</b>
                    </div>
                    <div class="flex items-center gap-1">
                        <text-field v-model={state.keyword} placeholder="검색하기" />
                        <button
                            type="button"
                            class="btn-refresh flex justify-center items-center"
                            onClick={onRefresh}
                        >
                            <i class="mdi mdi-refresh" />
                            <span class="tooltip tooltip-bottom">새로고침</span>
                        </button>
                    </div>
                </div>
                <div ref={contentRef} class="todo-page__content flex justify-start items-center">
                    {filterTodosByStatus.value.map((todos: any) => (
                        <div
                            class="todo-page__content-item"
                            onMouseup={(event: MouseEvent) =>
                                onContextMenu(event, { payload: todos })
                            }
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
                                        onClick={() => onToggleForm(true, todo)}
                                        onMouseup={(event: MouseEvent) =>
                                            onContextMenu(event, {
                                                type: 'card',
                                                payload: todo
                                            })
                                        }
                                        onDelete={onBeforeDelete}
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
                <Teleport to="body">
                    <modal-dialog
                        modelValue={state.todoForm.modal}
                        onUpdate:modelValue={onToggleForm}
                        persistent
                        hide-actions
                        width="70vw"
                    >
                        <todo-form
                            {...state.todoForm.todo}
                            sprints={state.todoForm.sprints}
                            onSubmit={onSubmitForm}
                            onCancel={onCancelForm}
                        />
                    </modal-dialog>
                </Teleport>
            </div>
        )
    }
})
