import { computed, defineComponent, type PropType } from 'vue'
import { CRAWLER_STATUS } from '@/costants/model'
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
        status: {
            type: Number as PropType<Crawler.IWorker['status']>,
            default: ''
        },
        commands: {
            type: Array as PropType<Crawler.IWorker['commands']>,
            default: () => []
        }
    },
    setup(props, { emit }) {
        const printStatus = computed(() => {
            let print = ''
            switch (props.status) {
                case CRAWLER_STATUS.PREPARE:
                    print = '준비'
                    break
                case CRAWLER_STATUS.WAITING:
                    print = '중지'
                    break
                case CRAWLER_STATUS.RUNNING:
                    print = '실행중'
                    break
                case CRAWLER_STATUS.COMPLETE:
                    print = '완료'
                    break
                case CRAWLER_STATUS.FAILED:
                    print = '실패'
                    break
            }
            return print
        })
        const onEdit = () => emit('edit')
        return () => (
            <div class="worker-card flex flex-col justify-between box-shadow">
                <div class="flex justify-between items-center">
                    <p onClick={onEdit}>{props.label}</p>
                    <span
                        class={{
                            'worker-status flex justify-center': true,
                            'worker-status--waiting': props.status === CRAWLER_STATUS.WAITING,
                            'worker-status--running': props.status === CRAWLER_STATUS.RUNNING,
                            'worker-status--complete': props.status === CRAWLER_STATUS.COMPLETE,
                            'worker-status--failed': props.status === CRAWLER_STATUS.FAILED
                        }}
                    >
                        {printStatus.value}
                    </span>
                </div>
                <div class="flex justify-end items-center"></div>
            </div>
        )
    }
})
