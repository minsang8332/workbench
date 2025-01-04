import _ from 'lodash'
import { computed, defineComponent, ref, unref, watch } from 'vue'
import './DrawerMenu.scoped.scss'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'DrawerMenu',
    setup(props, { slots }) {
        const appStore = useAppStore()
        const drawerContentRef = ref<HTMLElement>()
        const getClassList = computed(() => {
            const classList = ['drawer-menu']
            if (appStore.getDrawer) {
                classList.push('drawer-menu--active')
            }
            return _.join(classList, ' ')
        })
        return () => (
            <aside class={getClassList.value}>
                <div
                    ref={drawerContentRef}
                    class="drawer-menu__content flex flex-wrap overflow-hidden"
                >
                    {slots.default && slots.default()}
                </div>
            </aside>
        )
    }
})
