import { defineComponent, type PropType } from 'vue'
import './TodoSprintCard.scoped.scss'
export default defineComponent({
    name: 'TodoSprintCard',
    props: {
        title: {
            type: String as PropType<ITodoSprint['title']>,
            default: ''
        },
        checked: {
            type: Boolean as PropType<ITodoSprint['checked']>,
            default: false
        }
    },
    setup(props) {
        return () => (
            <div
                class={{
                    'todo-sprint-card flex justify-between items-center': true,
                    'todo-sprint-card--checked': props.checked
                }}
            >
                <div class="flex items-center gap-2">
                    <button type="button" class="btn-check">
                        <i class="mdi mdi-check" />
                        <span class="tooltip">완료</span>
                    </button>
                    <span>{props.title}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button">
                        <i class="mdi mdi-pencil" />
                        <span class="tooltip">편집</span>
                    </button>
                    <button type="button">
                        <i class="mdi mdi-delete" />
                        <span class="tooltip">삭제</span>
                    </button>
                </div>
            </div>
        )
    }
})
