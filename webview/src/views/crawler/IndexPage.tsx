import { defineComponent } from 'vue'
export default defineComponent({
    name: 'CrawlerPage',
    setup() {
        return () => (
            <article class="crawler-page h-full">
                <router-view />
            </article>
        )
    }
})
