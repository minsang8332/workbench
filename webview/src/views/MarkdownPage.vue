<template>
    <v-container fluid class="markdown-page">
        <v-card
            class="card-markdown-page fill-height"
            ref="card"
            flat
            :color="$app.scss('--theme-color-2')"
            outlined
            @mousemove="onMouseMove"
        >
            <v-row class="row-md-header text-truncate px-2" no-gutters>
                <v-col class="d-flex align-center">
                    <v-icon class="mr-1" :color="$app.scss('--dark-color')">
                        mdi-file-document-outline
                    </v-icon>
                    <b>
                        {{ path }}
                    </b>
                </v-col>
            </v-row>
            <v-divider />
            <v-row
                class="row-md-content pa-0"
                no-gutters
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
            >
                <v-col class="d-flex fill-height">
                    <div class="md-left-panel">
                        <textarea
                            v-model="editor"
                            ref="editor"
                            class="md-editor pa-2"
                            :style="{ width: editorX + 'px' }"
                            @keydown.ctrl.83.prevent.stop="onSave"
                        />
                    </div>
                    <div class="md-right-panel">
                        <div class="md-resizer" @mousedown="onMouseDown">
                            <v-btn
                                class="btn-md-resizer"
                                :color="$app.scss('--theme-color-2')"
                                text
                                fab
                                ><v-icon
                                    >mdi-arrow-split-vertical</v-icon
                                ></v-btn
                            >
                        </div>
                        <div
                            v-html="preview"
                            class="markdown-body md-preview px-4 py-2"
                        />
                    </div>
                </v-col>
            </v-row>
            <v-row class="row-md-footer text-truncate px-2" no-gutters>
                <v-col class="align-self-center">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                dark
                                text
                                block
                                v-bind="attrs"
                                v-on="on"
                                @click="onSave"
                            >
                                <v-icon>mdi-send</v-icon>
                            </v-btn>
                        </template>
                        <p class="white--text">저장하기</p>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { marked } from 'marked'
import 'github-markdown-css'
export default {
    name: 'MarkdownPage',
    props: {
        path: {
            type: [String],
            default: '',
        },
    },
    data() {
        return {
            resize: false,
            editor: '',
            editorX: null,
        }
    },
    watch: {
        async path(newValue) {
            if (newValue) {
                // this.onSave()
                this.onLoad()
            }
        },
    },
    computed: {
        preview() {
            return marked(this.editor)
        },
    },
    methods: {
        ...mapActions('markdown', ['loadMarkdown', 'saveMarkdown']),
        async onLoad() {
            const path = this.path
            try {
                this.editor = ''
                this.editor = await this.loadMarkdown({ path })
            } catch (e) {
                console.error(e)
            }
        },
        onMouseMove(event) {
            this.$nextTick(() => {
                if (this.resize == false) {
                    return
                }
                const card = this.$refs.card
                const editor = this.$refs.editor
                const domRect = editor.getBoundingClientRect()
                const limit = card.$el.clientWidth - 100
                // 이벤트가 없으면 최대폭으로 둔다
                if (!event) {
                    this.editorX = limit
                    return
                }
                let x = event.x
                // 좌측 사이드바가 열려있는 경우 그 폭만큼 빼준다.
                if (this.$app.drawer) {
                    x = event.x - domRect.x
                }
                if (x > limit) {
                    this.editorX = limit
                    return
                }
                this.editorX = x
            })
        },
        onMouseUp() {
            this.resize = false
        },
        onMouseDown() {
            this.resize = true
        },
        onSave() {
            const { path, editor: data } = this
            this.saveMarkdown({ path, data })
            const title = _.last(path.split('/'))
            this.$toast.success({ text: title + ' 파일이 저장되었습니다.' })
        },
    },
    mounted() {
        this.onLoad()
    },
}
</script>
<style lang="scss" scoped>
$rowHeight: 48px;
.markdown-page::v-deep {
    height: calc(100vh - var(--app-header-height));
    .row-md-header,
    .row-md-footer {
        height: $rowHeight;
        flex-shrink: 0;
    }
    .row-md-content {
        height: calc(100% - $rowHeight * 2);
        overflow-x: hidden;
        .md-editor {
            background: rgba(246, 246, 246, 0.8);
            height: 100%;
            min-width: 25vw;
            font-family: 'Monaco', courier, monospace;
            border: none;
            resize: none;
            outline: none;
        }
        .md-preview {
            overflow-y: auto;
        }
        .markdown-body {
            height: 100%;
        }
        .md-right-panel {
            height: 100%;
            position: relative;
            width: inherit;
            .md-resizer {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 4px;
                border-left: 1px solid var(--theme-color-3);
                cursor: col-resize;
                .btn-md-resizer {
                    position: absolute;
                    top: 50%;
                    left: -29.5px;
                }
            }
        }
    }
}
</style>
