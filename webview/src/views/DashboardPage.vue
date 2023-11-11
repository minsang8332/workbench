<template>
    <v-container class="dashboard-page fill-height" fluid>
        <v-card class="full-width fill-height" flat>
            <v-row class="row-recent-md" no-gutters>
                <v-col>
                    <h1 class="text-title pa-2">최근 작성한 문서</h1>
                    <v-divider />
                    <v-slide-group
                        v-model="selected"
                        class="pa-4"
                        show-arrows
                        center-active
                    >
                        <v-slide-item
                            v-for="(md, i) in markdowns"
                            :key="`recent-md-${i}`"
                            v-slot="{ toggle }"
                        >
                            <div @click="onClickRecentMarkdown(toggle)">
                                <md-preview-card v-bind="md" />
                            </div>
                        </v-slide-item>
                    </v-slide-group>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MdPreviewCard from '@/components/markdown/MdPreviewCard'
export default {
    name: 'DashboardPage',
    components: {
        MdPreviewCard,
    },
    data() {
        return {
            selected: null,
            markdowns: [],
        }
    },
    watch: {
        getRecentMarkdowns() {
            this.onLoad()
        },
    },
    computed: {
        ...mapGetters('markdown', ['getRecentMarkdowns']),
    },
    methods: {
        ...mapActions('markdown', ['loadMarkdown']),
        onClickRecentMarkdown(toggle = Function) {
            toggle()
            this.$nextTick(() => {
                const idx = this.selected
                const files = this.getRecentMarkdowns
                if (!(files && files[idx])) {
                    return
                }
                const md = files[idx]
                const { path } = md
                this.$router
                    .replace({
                        name: 'markdown-editor',
                        params: {
                            path,
                        },
                    })
                    .catch((e) => e)
            })
        },
        async onLoad() {
            const markdowns = await Promise.all(
                this.getRecentMarkdowns.map(async (md) => {
                    try {
                        const markdown = await this.loadMarkdown({
                            target: md.path,
                        })
                        if (!(markdown && markdown.text)) {
                            return md
                        }
                        md.text = markdown.text
                    } catch (e) {
                        console.error(e)
                    }
                    return md
                })
            )
            this.markdowns = markdowns
        },
    },
    mounted() {
        this.onLoad()
    },
}
</script>
<style lang="scss" scoped>
.dashboard-page::v-deep {
    .row-recent-md {
        height: 50%;
    }
}
</style>
