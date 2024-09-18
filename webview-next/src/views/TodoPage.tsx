import _ from 'lodash'
import { defineComponent, nextTick, ref, unref, inject, type ComponentPublicInstance, onMounted, Teleport, reactive } from 'vue'
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
            formProps: ITodo | null
        }>({
            form: false,
            formProps: null
        })
        const containerRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
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
                message: ['이 작업을 제거하시겠습니까 ?'],
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
            ]
            if (type == 'card') {
                items = [
                    ...items, 
                    {
                        name: 'edit-todo',
                        desc: '카드편집',
                        shortcut: 'E',
                        icon: 'fa-regular fa-pen-to-square',
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
            } else {
                items = [
                    ...items,
                    {
                        name: 'add-todo',
                        desc: '카드생성',
                        shortcut: 'N',
                        icon: 'fa-regular fa-pen-to-square',
                        color: appStore.scss('--dark-color'),
                        cb () {
                            toggleForm(true)
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
                            onSubmit={() => {
                                onRefresh()
                                toggleForm(false)
                            }}
                            onCancel={() => {
                                onRefresh()
                                toggleForm(false)
                            }}
                        />
                    </app-modal>
                </Teleport>
                <v-card class="todo-page__card" flat>
                    <v-row class="flex-0-0" no-gutters>
                        <v-col class="d-flex align-center pl-6">
                            <h3 class="text-title">작업 관리</h3>
                        </v-col>
                        <v-col class="align-center" align="end">
                            <v-btn
                                variant="text"
                                size="large"
                                onClick={onRefresh}
                            >
                                <v-icon class="ico-menu">fa-solid fa-rotate-right</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">새로고침</p>
                                </v-tooltip>
                            </v-btn>
                            <v-btn
                                variant="text"
                                size="large"
                            >
                                <v-icon class="ico-menu">fa-regular fa-square-plus</v-icon>
                                <v-tooltip activator="parent" location="top">
                                    <p class="text-white">작업 생성</p>
                                </v-tooltip>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider class="pa-1" />
                    <v-row ref={containerRef} class="todo-page__container px-6 pt-4 pb-6 ga-3" no-gutters onWheel={onScrollX}>
                        {
                            todoStore.getTodosByStatus.map((todos: any) => <v-col>
                                <v-card 
                                    class="todo-page__container-box" 
                                    outlined 
                                    onMouseup={(event: MouseEvent) => onMenu(event, { payload: todos })}
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