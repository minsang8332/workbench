import {
    defineComponent,
    computed,
    ref,
    unref,
    nextTick,
    inject,
    onMounted,
    type PropType
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDiaryStore } from '@/stores/diary'
import _ from 'lodash'
import styles from '@/components/diary/DiaryInputPath.module.scss'
export default defineComponent({
    name: 'DiaryInputPath',
    emits: ['toggle'],
    props: {
        path: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props, { emit }) {
        const $toast = inject('toast') as IToastPlugin
        const appStore = useAppStore()
        const route = useRoute()
        const router = useRouter()
        const diaryStore = useDiaryStore()
        const inputRef = ref<HTMLInputElement | null>(null)
        const printFileName = computed(() => {
            let filename
            try {
                const tmp = props.path.split('/')
                filename = _.last(tmp)
            } catch (e) {
                console.error(e)
            }
            return filename
        })
        const onInput = (event: Event) => {
            if (!(event && event.target)) {
                return
            }
            if (!inputRef.value) {
                return
            }
            if (event && event.target) {
                unref(inputRef.value).value = (event.target as HTMLInputElement).value
            }
        }
        const onFocus = () => {
            nextTick(() => {
                unref(inputRef)?.focus()
            })
        }
        const onFocusout = (event: Event) => {
            if (inputRef.value && unref(inputRef.value).value) {
                onUpdate(event)
            }
            onReset()
        }
        const onUpdate = async (event: Event) => {
            try {
                if ((event as KeyboardEvent).key && (event as KeyboardEvent).key != 'Enter') {
                    return
                }
                event.preventDefault()
                const rename = unref(inputRef)?.value as string
                if (_.isEmpty(rename)) {
                    return
                }
                const tmp = props.path.split('/')
                const filename = _.last(tmp)
                if (filename == rename) {
                    return
                }
                const { renamed } = await diaryStore.renameDiary({
                    target: props.path,
                    rename
                })
                $toast.success(`${rename} (으/로) 변경되었습니다.`)
                // 현재 작성중인 문서인 경우
                if (route.params.path == props.path) {
                    router
                        .replace({
                            name: 'diary',
                            params: { path: renamed }
                        })
                        .catch((e) => e)
                }
            } catch (e) {
                $toast.error(e as Error)
            }
            onReset()
        }
        const onReset = () => {
            if (inputRef.value) {
                unref(inputRef.value).value = ''
            }
            emit('toggle', false)
        }
        onMounted(() => {
            onFocus()
        })
        return () => (
            <input
                ref={inputRef}
                value={unref(printFileName)}
                class={`${styles['diary-input-path']} pa-0 ma-0`}
                color={appStore.scss('--theme-color-1')}
                onInput={onInput}
                onFocusout={onFocusout}
                onKeydown={onUpdate}
            />
        )
    }
})
