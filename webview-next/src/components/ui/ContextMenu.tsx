import { defineComponent, computed, ref, unref, watch, nextTick, type PropType } from 'vue'
import './ContextMenu.scoped.scss'
export default defineComponent({
    name: 'ContextMenu',
    props: {
        modelValue: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        items: {
            type: Array as PropType<IAppMenuItem[]>,
            default: () => []
        },
        pageX: {
            type: Number as PropType<number>,
            default: 0
        },
        pageY: {
            type: Number as PropType<number>,
            default: 0
        }
    },
    setup(props, { emit }) {
        const menuRef = ref<HTMLDivElement | null>(null)
        const styleMenu = computed(() => {
            return {
                top: props.pageY + 10 + 'px',
                left: props.pageX + 'px'
            }
        })
        const onFocus = () => {
            nextTick(() => {
                if (menuRef.value) {
                    menuRef.value.focus()
                }
            })
        }
        const onFocusout = (event: FocusEvent) => {
            // 메뉴카드에서 자식요소로 focus 가 옮겨갔을 경우 다시 이전
            if ((event.target as HTMLElement).contains(event.relatedTarget as HTMLElement)) {
                onFocus()
                return
            }
            onClose()
        }
        const onClickItem = (item: IAppMenuItem) => {
            if (item.cb) {
                item.cb()
            }
        }
        const onClose = () => {
            emit('update:modelValue', false)
        }
        watch(
            () => props.modelValue,
            (newValue) => {
                if (newValue) {
                    onFocus()
                }
            }
        )
        return () => (
            <div
                ref={menuRef}
                class="context-menu"
                style={unref(styleMenu)}
                v-show={props.modelValue}
                onFocusout={onFocusout}
                tabindex="0"
            >
                <div class="context-menu__header flex justify-end items-center h-7 px-2 w-100">
                    <button type="button" class="btn-close" onClick={onClose}>
                        <i class="mdi mdi-close" />
                    </button>
                </div>
                <div class="context-menu__content flex flex-col items-center gap-2">
                    {unref(props.items).map((item) => (
                        <button
                            type="button"
                            class="flex justify-between items-center h-6 px-2 w-100"
                            v-ripple
                            onClick={(event) => onClickItem(item)}
                        >
                            <div class="flex items-center gap-1">
                                <i class={item.icon} style={{ color: item.color }}></i>
                                <b class="text-label">{item.desc}</b>
                            </div>
                            {item.shortcut && <b class="text-shortcut">({item.shortcut})</b>}
                        </button>
                    ))}
                </div>
            </div>
        )
    }
})
