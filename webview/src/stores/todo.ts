import _ from 'lodash'
import { computed, unref, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { ITodo, ITodoSprint } from '@/types/model'
interface ITodoStoreState {
    todos: ITodo[]
}
export const useTodoStore = defineStore('todo', () => {
    const state = reactive<ITodoStoreState>({
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
    const saveTodo = async (payload: ITodo & { sprints?: ITodoSprint[] }) => {
        return await window.$native.todo.save(payload)
    }
    const deleteTodo = async (id: ITodo['id']) => {
        return await window.$native.todo.delete({ id })
    }
    const loadSprint = async (todoId: ITodo['id']) => {
        return await window.$native.todo.loadSprint({ todoId })
    }
    return {
        state,
        getTodos,
        loadTodos,
        saveTodo,
        deleteTodo,
        loadSprint
    }
})
