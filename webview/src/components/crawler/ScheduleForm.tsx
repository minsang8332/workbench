import { computed, defineComponent } from 'vue'
import SelectField from '@/components/form/SelectField'
export default defineComponent({
    name: 'ScheduleForm',
    components: {
        SelectField
    },
    setup() {
        const validate = computed(() => {
            return false
        })
        const onSubmit = (event: Event) => {
            event.preventDefault()
        }
        return () => (
            <form class="flex flex-col gap-2 w-full px-4" onSubmit={onSubmit}>
                <select-field />
            </form>
        )
    }
})
