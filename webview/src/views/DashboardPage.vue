<template>
    <v-container class="dashboard-page" fluid>
        <v-card flat>
            <v-row class="row-recent-md-title pa-2">
                <v-col>
                    <h1 class="text-title">최근 작성한 문서</h1>
                </v-col>
            </v-row>
            <v-divider class="pa-1" />
            <v-row no-gutters>
                <v-col
                    v-for="(md, i) in markdowns"
                    :key="`recent-md-${i}`"
                    cols="12"
                    md="4"
                    class="pa-4"
                >
                    <div
                        class="div-preview-card"
                        @click="onClickRecentMarkdown(md)"
                    >
                        <md-preview-card v-bind="md" />
                    </div>
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
        onClickRecentMarkdown(md) {
            const { path } = md
            this.$router
                .replace({
                    name: 'markdown-editor',
                    params: {
                        path,
                    },
                })
                .catch((e) => e)
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
    async mounted() {
        this.onLoad()
    },
}
</script>
<style lang="scss" scoped>
.dashboard-page::v-deep {
    .div-preview-card {
        height: 100%;
        min-height: 320px;
        max-height: 320px;
        width: 100%;
    }
}
</style>
