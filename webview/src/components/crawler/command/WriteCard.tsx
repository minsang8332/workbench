import { defineComponent } from 'vue'
import './WriteCard.scoped.scss'
export default defineComponent({
    name: 'WriteCard',
    setup() {
        const onDragstart = (event: DragEvent) => {}
        return () => (
            <div class="write-card flex flex-col" draggable onDragstart={onDragstart}>
                <div class="write-card__header flex justify-start items-center">
                    <b>입력하기</b>
                </div>
                <div class="write-card__content flex justify-center items-center"></div>
            </div>
        )
    }
})
