import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import _ from 'lodash'
interface ITodoState {
    todos: ITodo[]
}
export const useTodoStore = defineStore('todo', () => {
    const state = reactive<ITodoState>({
        todos: []
    })
    // Getters
    const getTodos = computed(() => state.todos)
    // Mutations
    const updateTodos = (payload: ITodo[] = []) => {
        state.todos = payload
    }
    // Actions
    const loadTodos = async () => {
        updateTodos()
        const response = await window.$native.todo.load()
        if (!(response && response.data)) {
            return false
        }
        updateTodos(response.data.todos)
    }
    const saveTodo = async (payload: ITodo) => {
        const response = await window.$native.todo.save(payload)
        if (!(response && response.data)) {
            return false
        }
        return response.data.id
    }
    const removeTodo = async (id: string) => {
        return await window.$native.todo.remove({ id })
    }
    return {
        state,
        getTodos,
        loadTodos,
        saveTodo,
        removeTodo
    }
})
