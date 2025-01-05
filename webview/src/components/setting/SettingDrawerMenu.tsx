import _ from 'lodash'
import { computed, reactive, defineComponent, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import commonUtil from '@/utils/common'
import TextField from '@/components/form/TextField'
import './SettingDrawerMenu.scoped.scss'
interface ISettingDrawerMenu {
    keyword: string
    items: ISettingDrawerMenuItem[]
}
interface ISettingDrawerMenuItem {
    icon: string
    name: string
    label: string
}
export default defineComponent({
    name: 'SettingDrawerMenu',
    components: {
        TextField
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const state = reactive<ISettingDrawerMenu>({
            keyword: '',
            items: [
                {
                    name: 'setting-passcode',
                    label: '패스코드 설정',
                    icon: 'mdi mdi-chevron-right'
                },
                {
                    name: 'setting-layout',
                    label: '레이아웃 설정',
                    icon: 'mdi mdi-chevron-right'
                }
            ]
        })
        const filterItems = computed(() => {
            let items: ISettingDrawerMenuItem[] = []
            try {
                items = state.items.filter((item) =>
                    commonUtil.searchByInitial(item.label, state.keyword)
                )
            } catch (e) {
                console.error(e)
            }
            return items
        })
        return () => (
            <div class="setting-drawer-menu flex flex-col gap-2">
                <div class="setting-drawer-menu__header">
                    <text-field v-model={state.keyword} placeholder="검색하기" />
                </div>
                <div class="setting-drawer-menu__content">
                    <ul class="setting-menu w-full">
                        {filterItems.value.map((item) => (
                            <li
                                class="setting-menu__item flex justify-start items-center gap-2"
                                onClick={() => router.push({ name: item.name })}
                            >
                                <i class={item.icon}></i>
                                <b>{item.label}</b>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
})
