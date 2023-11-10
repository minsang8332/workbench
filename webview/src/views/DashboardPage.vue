<template>
    <v-container class="dashboard-page fill-height" fluid>
        <v-card class="full-width fill-height" flat>
            <v-row class="row-recent-files" no-gutters>
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
                            v-slot="{ active, toggle }"
                        >
                            <v-card
                                class="ma-4"
                                height="40vh"
                                width="20vw"
                                @click="onClickRecentMarkdown(toggle)"
                            >
                                <v-row
                                    class="row-md-title bg-theme-1 px-2"
                                    no-gutters
                                >
                                    <v-col
                                        class="d-flex align-center fill-height white--text text-truncate"
                                    >
                                        <span class="white--text">{{
                                            md.title
                                        }}</span>
                                    </v-col>
                                </v-row>
                                <v-row class="row-md-preview" no-gutters>
                                    <v-col>
                                        <md-preview :text="md.text" />
                                        <v-scale-transition>
                                            <template v-if="active"></template>
                                        </v-scale-transition>
                                    </v-col>
                                </v-row>
                                <v-divider />
                                <v-row
                                    class="row-md-created-at pa-2"
                                    no-gutters
                                >
                                    <v-col
                                        class="d-flex flex-column text-truncate"
                                    >
                                        <p
                                            class="text-created-at text-truncate"
                                        >
                                            작성일
                                            {{ printDate(md.createdAt) }}
                                        </p>
                                        <p
                                            class="text-created-at text-truncate"
                                        >
                                            수정일
                                            {{ printDate(md.updatedAt) }}
                                        </p>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-slide-item>
                    </v-slide-group>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'
import MdPreview from '@/components/markdown/MdPreview'
export default {
    name: 'DashboardPage',
    components: {
        MdPreview,
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
        printDate(date) {
            date = dayjs(new Date(date))
            if (date.isValid()) {
                date = date.format('YYYY년 MM월 DD일 HH:mm:ss')
                return date
            }
            return null
        },
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
    .row-recent-files {
        height: 50%;
        .row-md-preview {
            height: 70%;
            overflow-y: hidden;
        }
        .row-md-title {
            height: 10%;
        }
        .row-md-created-at {
            height: 20%;
            .text-created-at {
                font-size: 13px;
            }
        }
    }
}
</style>
