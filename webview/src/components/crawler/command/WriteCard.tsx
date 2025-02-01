import _ from 'lodash'
import { reactive, computed, defineComponent, type PropType, onMounted } from 'vue'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import TextField from '@/components/form/TextField'
import type { Crawler } from '@/types/model'
import './BaseCard.scoped.scss'
interface IWriteCardState {
    inputSelector: string
    inputText: string
    inputTimeout: number
    inputTimeoutRules: ((value: number) => string | boolean)[]
}
export default defineComponent({
    name: 'WriteCard',
    components: {
        TextField
    },
    emits: ['replace', 'splice'],
    props: {
        selector: {
            type: String as PropType<Crawler.Command.IClick['selector']>,
            default: ''
        },
        text: {
            type: String as PropType<Crawler.Command.IRedirect['url']>
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
        },
        validate: {
            type: Boolean as PropType<boolean>,
            default: false
        }
    },
    setup(props, { emit }) {
        const { onCommandForm, onUpdateWriteCommand } = useCrawler(crawlerState)
        const state = reactive<IWriteCardState>({
            inputSelector: props.selector ?? '',
            inputText: props.text ?? '',
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
        const onSubmit = (event?: Event) => {
            if (event) {
                event.preventDefault()
            }
            if (validate.value === true && _.isNumber(props.sortNo)) {
                onUpdateWriteCommand(
                    props.sortNo,
                    state.inputSelector,
                    state.inputText,
                    state.inputTimeout,
                    validate.value
                )
            }
            if (event) {
                onCommandForm(false)
            }
        }
        onMounted(() => {
            onSubmit()
        })
        return () => (
            <div
                class={{
                    'base-card flex flex-col': true,
                    'base-card--form': props.form,
                    'base-card--validate': _.isNumber(props.sortNo) && props.validate === false
                }}
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
                                v-model={state.inputText}
                                label="문자열"
                                placeholder="스크래핑 대상에 입력할 문구를 입력해 주세요."
                            />
                            <text-field
                                v-model={state.inputTimeout}
                                rules={state.inputTimeoutRules}
                                type="number"
                                label="입력시간 (ms)"
                                placeholder="입력에 소요되는 시간을 초과하지 않도록 합니다."
                            />
                        </div>
                        <div class="base-card__actions flex justify-center items-center gap-6">
                            <button
                                type="button"
                                class="btn-cancel"
                                onClick={(e) => onCommandForm(false)}
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
                            <span class="text-white">입력하기</span>
                            {_.isNumber(props.sortNo) && (
                                <span class="text-white">{props.sortNo + 1}</span>
                            )}
                        </div>
                        <div class="base-card__content flex flex-col justify-center items-center gap-1">
                            <p class="text-white break-all">{props.text}</p>
                        </div>
                    </>
                )}
            </div>
        )
    }
})
