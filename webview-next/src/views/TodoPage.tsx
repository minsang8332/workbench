import { defineComponent, ref, unref, reactive, type ComponentPublicInstance, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import TodoCard from '@/components/todo/TodoCard'
import '@/views/TodoPage.scoped.scss'
export default defineComponent({
    name: 'TodoPage',
    components: {
        TodoCard
    },
    setup() {
        const todoStore = useTodoStore()
        const containerRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
        const onScrollX = (event: WheelEvent) => {
            const container = unref(containerRef)
            if (!(container && container.$el)) {
                return
            }
            container.$el.scrollLeft += event.deltaY
        }
        onMounted(() => {
            todoStore.loadTodos()
        })
        return () => (
            <v-container class="todo-page pa-0">
                <v-card class="todo-page__card" flat>
                    <v-row class="flex-0-0" no-gutters>
                        <v-col class="d-flex align-center pl-6">
                            <h3 class="text-title">작업 관리</h3>
                        </v-col>
                        <v-col class="align-center" align="end">
                            <v-btn
                                variant="text"
                                size="large"
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
                                <v-card class="todo-page__container-box" outlined>
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
                                                todos.items.map((todo: ITodo) => <todo-card {...todo} />)
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