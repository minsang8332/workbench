import _ from 'lodash'
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
import { useDiaryStore } from '@/stores/diary'
import './DiaryTextField.scoped.scss'
export default defineComponent({
    name: 'DiaryTextField',
    emits: ['update'],
    props: {
        path: {
            type: String as PropType<string>,
            default: ''
        }
    },
    setup(props, { emit }) {
        const $toast = inject('toast') as IToastPlugin
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
                    return false
                }
                event.preventDefault()
                const filename = unref(inputRef)?.value as string
                if (_.isEmpty(filename)) {
                    return false
                }
                // 기존 파일명이 변경할 파일과 일치한다면
                const originalFilepath = props.path.split('/')
                if (filename == _.last(originalFilepath)) {
                    return false
                }
                const filepath = await diaryStore.renameDiary({
                    filepath: props.path,
                    filename
                })
                $toast.success(`${filename} (으/로) 변경되었습니다.`)
                // 현재 작성중인 문서인 경우
                if (route.params.path == props.path) {
                    router
                        .replace({
                            name: 'diary-detail',
                            params: { path: filepath }
                        })
                        .catch((e) => e)
                }
                await diaryStore.loadDiaries()
            } catch (e) {
                $toast.error(e as Error)
            }
            onReset()
        }
        const onReset = () => {
            if (inputRef.value) {
                unref(inputRef.value).value = ''
            }
            emit('update', false)
        }
        onMounted(() => {
            onFocus()
        })
        return () => (
            <input
                ref={inputRef}
                class="diary-text-field"
                value={unref(printFileName)}
                onInput={onInput}
                onFocusout={onFocusout}
                onKeydown={onUpdate}
            />
        )
    }
})
