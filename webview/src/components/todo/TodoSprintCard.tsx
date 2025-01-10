import { defineComponent, type PropType } from 'vue'
import './TodoSprintCard.scoped.scss'
export default defineComponent({
    name: 'TodoSprintCard',
    emits: ['check', 'edit', 'delete'],
    props: {
        id: {
            type: String as PropType<ITodoSprint['id']>,
            default: ''
        },
        title: {
            type: String as PropType<ITodoSprint['title']>,
            default: ''
        },
        checked: {
            type: Boolean as PropType<ITodoSprint['checked']>,
            default: false
        }
    },
    setup(props, { emit }) {
        const onEdit = () => {
            console.log('edit')
        }
        return () => (
            <div
                class={{
                    'todo-sprint-card flex justify-between items-center': true,
                    'todo-sprint-card--checked': props.checked
                }}
            >
                <div class="flex items-center gap-2">
                    <button type="button" class="btn-check" onClick={() => emit('check', props.id)}>
                        <i class="mdi mdi-check" />
                        <span class="tooltip">체크하기</span>
                    </button>
                    <span>{props.title}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button type="button" onClick={onEdit}>
                        <i class="mdi mdi-pencil" />
                        <span class="tooltip">편집하기</span>
                    </button>
                    <button type="button" onClick={() => emit('delete', props.id)}>
                        <i class="mdi mdi-delete" />
                        <span class="tooltip">삭제하기</span>
                    </button>
                </div>
            </div>
        )
    }
})
