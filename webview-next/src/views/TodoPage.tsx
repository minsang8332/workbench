import { defineComponent, ref, unref, reactive, type ComponentPublicInstance } from 'vue'
import '@/views/TodoPage.scoped.scss'
export default defineComponent({
    name: 'TodoPage',
    setup() {
        const containerRef = ref<ComponentPublicInstance<HTMLElement> | null>(null)
        const state = reactive({
            todos: [
                {
                    status: 'PREPARE',
                    label: '해야할일',
                },
                {
                    status: 'PROCESS',
                    label: '진행중',
                },
                {
                    status: 'DONE',
                    label: '완료',
                },
                {
                    status: 'HOLD',
                    label: '보류',
                }
            ],
        })
        const onScrollX = (event: WheelEvent) => {
            const container = unref(containerRef)
            if (!(container && container.$el)) {
                return
            }
            container.$el.scrollLeft += event.deltaY
        }
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
                            state.todos.map(todo => <v-col>
                                <v-card class="todo-page__container-box" outlined>
                                    <v-row class="bg-theme-1 py-2 px-4" no-gutters>
                                        <v-col>
                                            <h5 class="text-title">{ todo.label }</h5>
                                        </v-col>
                                    </v-row>
                                    <v-divider />
                                </v-card>
                            </v-col>)
                        }
                    </v-row>
                </v-card>
            </v-container>
        )
    }
})