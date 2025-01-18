import _ from 'lodash'
import { reactive, computed, defineComponent, type PropType } from 'vue'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import TextField from '@/components/form/TextField'
import type { Crawler } from '@/types/model'
import './BaseCard.scoped.scss'
interface IClickCardState {
    inputSelector: string
    inputTimeout: number
    inputTimeoutRules: ((value: number) => string | boolean)[]
}
export default defineComponent({
    name: 'ClickCard',
    components: {
        TextField
    },
    emits: ['replace', 'splice'],
    props: {
        selector: {
            type: String as PropType<Crawler.Command.IClick['selector']>,
            default: ''
        },
        timeout: {
            type: Number as PropType<Crawler.Command.IRedirect['timeout']>,
            default: 5000
        },
        sortNo: {
            type: Number as PropType<number | null>,
            default: null
        },
        form: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props, { emit }) {
        const {
            onToggleCommandForm,
            onDropOntoCard,
            onMoveAnyCommand,
            onCreateClickCommand,
            onUpdateClickCommand
        } = useCrawler(crawlerState)
        const state = reactive<IClickCardState>({
            inputSelector: props.selector ?? '',
            inputTimeout: props.timeout ?? 5000,
            inputTimeoutRules: [
                (value: number): string | boolean => {
                    return value && value >= 0 ? true : '0 이상의 숫자를 입력해 주세요'
                }
            ]
        })
        const validate = computed(() => {
            return state.inputTimeoutRules.every((fn) => fn(state.inputTimeout) === true)
        })
        const onSubmit = (event: Event) => {
            event.preventDefault()
            if (validate.value === true && _.isNumber(props.sortNo)) {
                onUpdateClickCommand(props.sortNo, state.inputSelector, state.inputTimeout)
                onToggleCommandForm(false)
            }
        }
        return () => (
            <div
                class={{
                    'base-card flex flex-col': true,
                    'base-card--form': props.form
                }}
                draggable
                onDragstart={(event) =>
                    _.isNumber(props.sortNo)
                        ? onMoveAnyCommand(event, props.sortNo)
                        : onCreateClickCommand(event)
                }
                onDragover={(e) => e.preventDefault()}
                onDrop={(e) => onDropOntoCard(e, props.sortNo)}
            >
                {props.form ? (
                    <form onSubmit={onSubmit}>
                        <div class="base-card__content flex flex-col justify-center items-center gap-1">
                            <text-field
                                v-model={state.inputSelector}
                                label="스크래핑 대상"
                                placeholder="값이 없는 경우 브라우저 화면에서 선택하도록 합니다."
                            />
                            <text-field
                                v-model={state.inputTimeout}
                                rules={state.inputTimeoutRules}
                                type="number"
                                label="클릭시간 (ms)"
                                placeholder="클릭에 소요되는 시간을 초과하지 않도록 합니다."
                            />
                        </div>
                        <div class="base-card__actions flex justify-center items-center gap-6">
                            <button
                                type="button"
                                class="btn-cancel"
                                onClick={(e) => onToggleCommandForm(false)}
                            >
                                취소
                            </button>
                            <button type="submit" class="btn-submit" disabled={!validate.value}>
                                확인
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div class="base-card__header flex justify-between items-center gap-1 ">
                            <span class="text-white">클릭하기</span>
                            {_.isNumber(props.sortNo) && (
                                <span class="text-white">{props.sortNo + 1}</span>
                            )}
                        </div>
                        <div class="command-card__content flex flex-col justify-center items-center gap-1">
                            <p class="text-white break-all">{props.selector}</p>
                        </div>
                    </>
                )}
            </div>
        )
    }
})
