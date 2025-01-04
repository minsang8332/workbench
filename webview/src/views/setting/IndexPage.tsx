import { defineComponent } from 'vue'
import './IndexPage.scoped.scss'
export default defineComponent({
    name: 'SettingPage',
    setup() {
        return () => (
            <article class="setting-page">
                <div class="setting-page__header flex justify-between items-center">
                    <div class="flex items-center">
                        <button type="button" class="btn-setting flex justify-center items-center">
                            <i class="mdi mdi-cog"></i>
                            <span class="tooltip">초기 화면</span>
                        </button>
                        <h3 class="text-title">환경 설정</h3>
                    </div>
                    <div class="flex items-center"></div>
                </div>
                <router-view />
            </article>
        )
    }
})
