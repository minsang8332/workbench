import { defineComponent, type PropType } from 'vue'
import type { Crawler } from '@/types/model'
import './WorkerCard.scoped.scss'
export default defineComponent({
    name: 'WorkerCard',
    emits: ['edit'],
    props: {
        id: {
            type: String as PropType<Crawler.IWorker['id']>
        },
        label: {
            type: String as PropType<Crawler.IWorker['label']>,
            default: ''
        },
        commands: {
            type: Array as PropType<Crawler.IWorker['commands']>,
            default: () => []
        },
        active: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props, { emit }) {
        const onEdit = () => emit('edit')
        return () => (
            <div
                class={{
                    'worker-card flex flex-col justify-between box-shadow': true,
                    'worker-card--active': props.active
                }}
            >
                <div class="flex justify-between items-center">
                    <p onClick={onEdit}>{props.label}</p>
                </div>
                <div class="flex justify-end items-center"></div>
            </div>
        )
    }
})
