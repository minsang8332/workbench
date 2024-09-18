import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
export const useTodoStore = defineStore('todo', () => {
    const state = reactive<ITodoState>({
        todos: [],
        status: [
            {
                value: 0,
                label: '해야할일',
            },
            {
                value: 1,
                label: '진행중',
            },
            {
                value: 2,
                label: '완료',
            },
            {
                value: 3,
                label: '보류',
            }
        ],
    })
    const getTodos = computed(() => state.todos)
    const getStatus = computed(() => state.status)
    const loadTodos = async () => {
        const response = await window.$native.todo.readAll()
        const { todos } = response.data
        state.todos = todos
        return { todos }
    }
    const saveTodo = async (payload: ITodo) => {
        const response = await window.$native.todo.save(payload)
        const { id } = response.data
        return { id }    
    }
    const removeTodo = async (id: string) => {
        const response = await window.$native.todo.remove({ id })
        const { todos } = response.data
        state.todos = todos
        return { todos }    
    }
    return {
        state,
        getTodos,
        getStatus,
        loadTodos,
        saveTodo,
        removeTodo
    }
})
