import { defineComponent, computed, ref, unref, watch, nextTick, type PropType } from 'vue'
import './AppMenu.scoped.scss'
export default defineComponent({
    name: 'AppMenu',
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
                class="app-menu"
                style={unref(styleMenu)}
                v-show={props.modelValue}
                onFocusout={onFocusout}
                tabindex="0"
            >
                <v-row class="bg-theme-1" no-gutters dense>
                    <v-col align="end">
                        <v-btn size="small" dense variant="text" onClick={onClose}>
                            <v-icon class="text-white">mdi:mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider />
                <v-row no-gutters>
                    <v-col>
                        <ul class="fill-width">
                            {unref(props.items).map((item) => (
                                <v-btn
                                    class="d-flex justify-space-between"
                                    variant="text"
                                    block
                                    onClick={() => onClickItem(item)}
                                >
                                    <div class="d-flex">
                                        <v-icon class="mr-1" color={item.color}>
                                            {item.icon}
                                        </v-icon>
                                        <b class="diary-menu__desc">{item.desc}</b>
                                    </div>
                                    <div class="d-flex">
                                        {item.shortcut && (
                                            <b class="diary-menu__shortcut">({item.shortcut})</b>
                                        )}
                                    </div>
                                </v-btn>
                            ))}
                        </ul>
                    </v-col>
                </v-row>
            </div>
        )
    }
})
