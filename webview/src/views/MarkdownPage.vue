<template>
    <v-container fluid class="markdown-page">
        <v-card
            class="card-markdown-page fill-height"
            flat
            :color="$app.scss('--theme-color-2')"
            outlined
            @mousemove="onMouseMove"
        >
            <v-row class="row-md-header text-truncate pa-2" no-gutters>
                <v-col>
                    <v-icon :color="$app.scss('--dark-color')">
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
                <v-col class="d-flex">
                    <div class="md-left-panel fill-height">
                        <textarea
                            v-model="editor"
                            ref="editor"
                            class="md-editor pa-2"
                            :style="{ width: editorX + 'px' }"
                            @keydown.ctrl.83.prevent.stop="onSave"
                        />
                    </div>
                    <div class="md-right-panel fill-height">
                        <div
                            class="md-resizer"
                            ref="resizer"
                            @mousedown="onMouseDown"
                        >
                            <v-btn
                                class="btn-md-resizer"
                                :color="$app.scss('--theme-color-2')"
                                text
                                fab
                                small
                                ><v-icon
                                    >mdi-arrow-split-vertical</v-icon
                                ></v-btn
                            >
                        </div>
                        <div
                            v-html="preview"
                            class="markdown-body md-preview text-truncate px-4 py-2"
                        />
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
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
                if (!this.resize) {
                    return
                }
                const editor = this.$refs.editor
                const domRect = editor.getBoundingClientRect()
                let x = event.x
                // 좌측 사이드바가 열려있는 경우 그 폭만큼 빼준다.
                if (this.$app.drawer) {
                    x = event.x - domRect.x
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
        },
    },
    mounted() {
        this.onLoad()
    },
}
</script>
<style lang="scss" scoped>
.markdown-page::v-deep {
    height: 100%;
    .row-md-header {
        min-height: 40px;
    }
    .row-md-content {
        height: calc(100% - 42px);
        .md-right-panel {
            position: relative;
            width: inherit;
        }
        .md-editor {
            background: #f6f6f6;
            height: 100%;
            min-width: 25vw;
            font-family: 'Monaco', courier, monospace;
            border: none;
            resize: none;
            outline: none;
        }
        .markdown-body {
            height: 100%;
        }
        .md-resizer {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 4px;
            border-left: 1px solid var(--theme-color-2);
            cursor: col-resize;
            .btn-md-resizer {
                position: absolute;
                top: 50%;
                left: -20.5px;
            }
        }
    }
}
</style>
