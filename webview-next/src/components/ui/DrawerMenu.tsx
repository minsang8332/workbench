import _ from 'lodash'
import { computed, defineComponent } from 'vue'
import './DrawerMenu.scoped.scss'
import { useAppStore } from '@/stores/app'
export default defineComponent({
    name: 'DrawerMenu',
    setup(props, { slots }) {
        const appStore = useAppStore()
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
                    class="drawer-menu__content"
                    style={{
                        display: !appStore.getDrawer ? 'none' : 'block'
                    }}
                >
                    {slots.default && slots.default()}
                </div>
            </aside>
        )
    }
})
