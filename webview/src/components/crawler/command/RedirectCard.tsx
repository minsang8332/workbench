import _ from 'lodash'
import { watch, reactive, computed, defineComponent, type PropType, onMounted } from 'vue'
import { crawlerState, useCrawler } from '@/composables/useCrawler'
import TextField from '@/components/form/TextField'
import type { Crawler } from '@/types/model'
import './BaseCard.scoped.scss'
interface IRedirectCardState {
    inputUrl: string
    inputUrlRules: ((value: string) => string | boolean)[]
    inputTimeout: number
    inputTimeoutRules: ((value: number) => string | boolean)[]
}
export default defineComponent({
    name: 'RedirectCard',
    components: {
        TextField
    },
    emits: ['replace', 'splice', 'validate'],
    props: {
        url: {
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
    setup(props) {
        const {
            onToggleCommandForm,
            onDropOntoCard,
            onMoveAnyCommand,
            onCreateRedirectCommand,
            onUpdateRedirectCommand
        } = useCrawler(crawlerState)
        const state = reactive<IRedirectCardState>({
            inputUrl: props.url ?? '',
            inputUrlRules: [
                (value: string): string | boolean => {
                    return value &&
                        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-._~:?#&=+%,;]*)?$/.test(
                            value
                        )
                        ? true
                        : 'URL이 유효하지 않습니다.'
                }
            ],
            inputTimeout: props.timeout ?? 5000,
            inputTimeoutRules: [
                (value: number): string | boolean => {
                    return value && value >= 0 ? true : '0 이상의 숫자를 입력해 주세요'
                }
            ]
        })
        const validate = computed(
            () =>
                state.inputUrlRules.every((fn) => fn(state.inputUrl) === true) &&
                state.inputTimeoutRules.every((fn) => fn(state.inputTimeout) === true)
        )
        const onSubmit = (event?: Event) => {
            if (event) {
                event.preventDefault()
            }
            if (validate.value === true && _.isNumber(props.sortNo)) {
                onUpdateRedirectCommand(
                    props.sortNo,
                    state.inputUrl,
                    state.inputTimeout,
                    validate.value
                )
            }
            if (event) {
                onToggleCommandForm(false)
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
                draggable
                onDragstart={(event) =>
                    _.isNumber(props.sortNo)
                        ? onMoveAnyCommand(event, props.sortNo)
                        : onCreateRedirectCommand(event)
                }
                onDragover={(e) => e.preventDefault()}
                onDrop={(e) => onDropOntoCard(e, props.sortNo)}
            >
                {props.form ? (
                    <form onSubmit={onSubmit}>
                        <div class="base-card__content flex flex-col justify-center items-center gap-1">
                            <text-field
                                v-model={state.inputUrl}
                                rules={state.inputUrlRules}
                                label="URL"
                                placeholder="URL을 입력해 주세요."
                            />
                            <text-field
                                v-model={state.inputTimeout}
                                rules={state.inputTimeoutRules}
                                type="number"
                                label="이동시간 (ms)"
                                placeholder="이동에 소요되는 시간을 초과하지 않도록 합니다."
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
                            <span class="text-white">이동하기</span>
                            {_.isNumber(props.sortNo) && (
                                <span class="text-white">{props.sortNo + 1}</span>
                            )}
                        </div>
                        <div class="base-card__content flex flex-col justify-center items-center gap-1">
                            <p class="text-white break-all">{props.url}</p>
                        </div>
                    </>
                )}
            </div>
        )
    }
})
