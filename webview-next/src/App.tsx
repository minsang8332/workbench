import { defineComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { useDiaryStore } from '@/stores/diary'
export default defineComponent({
    name: 'App',
    setup() {
        const diaryStore = useDiaryStore()
        onBeforeMount(() => {
            diaryStore.loadDiaries().catch((e) => e)
        })
        return () => <RouterView />
    }
})
