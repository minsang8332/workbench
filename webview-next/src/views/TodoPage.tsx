import _ from 'lodash'
import { defineComponent, computed, ref, unref, inject, type ComponentPublicInstance, onMounted, Teleport, reactive } from 'vue'
import { useAppStore } from '@/stores/app'
import { useTodoStore } from '@/stores/todo'
import AppMenu from '@/layouts/AppMenu'
import AppModal from '@/layouts/AppModal'
import TodoCard from '@/components/todo/TodoCard'
import TodoForm from '@/components/todo/TodoForm'
import '@/views/TodoPage.scoped.scss'
export default defineComponent({
    name: 'TodoPage',
    components: {
        AppMenu,
        AppModal,
        TodoCard,
        TodoForm
    },
    setup() {
        const $toast = inject('toast') as IToastPlugin
        const appStore = useAppStore()
        const todoStore = useTodoStore()
        const state = reactive<{
            form: boolean
            formProps: ITodo | null,
            keyword: string
        }>({
            form: false,
            formProps: null,
            keyword: ''
        })
        const containerRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
        const filterTodosByStatus = computed(() => {
            let todoMap = []
            try {
                const status = unref(todoStore.getStatus)
                const todos = unref(todoStore.getTodos)
                todoMap = status.reduce((acc: any, s: ITodoStatus) => {
                    let items = [] as ITodo[]
                    if (todos && todos.length > 0) {
                        items = todos.filter((todo: ITodo) => {
                            if (todo.status !== s.value) {
                                return false
                            }
                            // 만약 검색 키워드가 있다면
                            if (state.keyword) {
                                return _.find(todo, (v: keyof ITodo, k: string) => k !== 'id' && _.isString(v) && v.includes(state.keyword)) ? true : false
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
            }
            else if (value == false) {
                state.formProps = null
            }
        }
        const onScrollX = (event: WheelEvent) => {
            const container = unref(containerRef)
            if (!(container && container.$el)) {
                return
            }
            container.$el.scrollLeft += event.deltaY
        }
        const onRefresh = () => todoStore.loadTodos().catch(e => e)
        const onBeforeRemove = ({ title, id }: { title: string, id: string }) => {
            appStore.toggleModal(true, {
                title: _.toString(title),
                message: ['이 카드를 제거하시겠습니까 ?'],
                ok() {
                    todoStore.removeTodo(id)
                        .then(() => {
                            $toast.success('정상적으로 제거되었습니다.')
                            appStore.toggleModal(false)
                        })
                        .catch(e => $toast.error(e))
                        .finally(() => todoStore.loadTodos().catch(e => e))
                }
            })
        }
        // 메뉴창 열기
        const onMenu = (event: MouseEvent, {
            type = 'container',
            payload = null
        }: {
            type?: 'container' | 'card'
            payload: any
        }) => {
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
                    color: appStore.scss('--dark-color'),
                    cb () {
                        onRefresh()
                        appStore.toggleMenu(false)
                    }
                },
                {
                    name: 'add-todo',
                    desc: '카드생성',
                    shortcut: 'N',
                    icon: 'mdi:mdi-file-edit-outline',
                    color: appStore.scss('--dark-color'),
                    cb () {
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
                        color: appStore.scss('--dark-color'),
                        cb () {}
                    },
                    {
                        name: 'remove-todo',
                        desc: '카드삭제',
                        shortcut: 'D',
                        icon: 'mdi:mdi-trash-can-outline',
                        color: appStore.scss('--dark-color'),
                        cb () {
                            onBeforeRemove(payload)
                            appStore.toggleMenu(false)
                        }
                    },
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
            <v-container class="todo-page pa-0">
                <app-menu
                    {...appStore.state.menuProps}
                    modelValue={appStore.state.menu}
                    onUpdate:modelValue={appStore.toggleMenu}
                />
                <Teleport to="body">
                    <app-modal
                        title={state.formProps && state.formProps.title ? state.formProps.title : '카드생성'}
                        modelValue={state.form}
                        onUpdate:modelValue={toggleForm}
                        persistent
                        hide-actions
                    >
                        <todo-form 
                            {...state.formProps} 
                            onSubmit={onSubmit}
                            onCancel={onCancel}
                        />
                    </app-modal>
                </Teleport>
                <v-card class="todo-page__card" flat>
                    <v-row class="flex-0-0" no-gutters>
                        <v-col class="d-flex align-center ga-2 pl-6">
                            <h3 class="text-title">작업 관리</h3>
                        </v-col>
                        <v-col class="align-center" align="end">
                            <v-btn
                                variant="text"
                                size="large"
                                onClick={onRefresh}
                            >
                                <v-icon class="ico-menu">mdi:mdi-refresh</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">새로고침</p>
                                </v-tooltip>
                            </v-btn>
                            <v-btn
                                variant="text"
                                size="large"
                                onClick={() => toggleForm(true)}
                            >
                                <v-icon class="ico-menu">mdi:mdi-file-edit-outline</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">카드생성</p>
                                </v-tooltip>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider />
                    <v-row class="px-6 pt-4 flex-0-0" no-gutters>
                        <v-col align="end">
                            <v-text-field
                                v-model={state.keyword}
                                label="검색하기"
                                append-inner-icon="mdi:mdi-magnify"
                                variant="outlined"
                                density="compact"
                                hide-details
                                width="15rem"
                            />
                        </v-col>
                    </v-row>
                    <v-row ref={containerRef} class="todo-page__container px-6 pt-4 pb-6 ga-3" no-gutters onWheel={onScrollX}>
                        {
                            unref(filterTodosByStatus).map((todos: any) => <v-col>
                                <v-card 
                                    class="todo-page__container-box"
                                    outlined
                                    onMouseup={(event: MouseEvent) => onMenu(event, { payload: todos })}
                                    onDragenter={onPrevent}
                                    onDragover={onPrevent}
                                    onDrop={(event: DragEvent) => onDrop(event, todos.value)}
                                >
                                    <v-row class="bg-theme-1 py-2 px-4" no-gutters>
                                        <v-col>
                                            <h5 class="text-title">{ todos.label }</h5>
                                        </v-col>
                                        <v-col align="end">
                                            <h5 class="text-title">{ todos.items.length }</h5>
                                        </v-col>
                                    </v-row>
                                    <v-divider />
                                    <v-row no-gutters>
                                        <v-col class="d-flex flex-column ga-3 pa-2">
                                            {
                                                todos.items.map((todo: ITodo) => 
                                                    <todo-card 
                                                        {...todo}
                                                        onClick={() => toggleForm(true, todo)}
                                                        onMouseup={(event: MouseEvent) => onMenu(event, { type: 'card', payload: todo  })}
                                                        onRemove={onBeforeRemove}
                                                        draggable
                                                        onDragenter={onPrevent}
                                                        onDragover={onPrevent}
                                                        onDragstart={(event: DragEvent) => onDragstart(event, todo)}
                                                    />
                                                )
                                            }
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>)
                        }
                    </v-row>
                </v-card>
            </v-container>
        )
    }
})