<template>
    <v-container fluid class="md-editor-page pa-0">
        <v-card
            class="card-md fill-height"
            ref="card"
            flat
            tile
            outlined
            @mousemove="onMouseMove"
        >
            <v-row class="row-md-header text-truncate px-2" no-gutters>
                <v-col class="d-flex align-center">
                    <v-icon class="mr-1" :color="$app.scss('--dark-color')">
                        mdi-file-document-outline
                    </v-icon>
                    <b class="text-title">
                        {{ printPath }}
                    </b>
                </v-col>
            </v-row>
            <v-divider :color="$app.scss('--theme-color-2')" />
            <v-row
                class="row-md-content pa-0"
                no-gutters
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
            >
                <v-col class="d-flex fill-height">
                    <!-- s: 입력창 -->
                    <div class="md-left-panel">
                        <textarea
                            v-model="editor"
                            ref="editor"
                            class="md-editor d2coding pa-2"
                            :style="{ width: editorWidth + 'px' }"
                            @keydown.ctrl.83.prevent.stop="onSave"
                        />
                    </div>
                    <!-- e: 입력창 -->
                    <!-- s: 프리뷰 -->
                    <div class="md-right-panel">
                        <div class="md-resizer" @mousedown="onMouseDown">
                            <v-btn
                                class="btn-md-resizer"
                                text
                                fab
                                :color="$app.scss('--theme-color-2')"
                                ><v-icon>fa-solid fa-compress</v-icon></v-btn
                            >
                        </div>
                        <md-preview :text="editor" />
                    </div>
                    <!-- e: 프리뷰 -->
                </v-col>
            </v-row>
            <v-divider :color="$app.scss('--theme-color-2')" />
            <v-row class="row-md-footer text-truncate px-2" no-gutters>
                <v-col class="align-self-center">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                class="btn-md-save pulsing"
                                dark
                                block
                                v-bind="attrs"
                                v-on="on"
                                @click="onSave"
                            >
                                <v-icon>mdi-send</v-icon>
                            </v-btn>
                        </template>
                        <p class="white--text">파일을 저장해 주세요.</p>
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import MdPreview from '@/components/markdown/MdPreview'
export default {
    name: 'MdEditorPage',
    props: {
        path: {
            type: [String],
            default: '',
        },
    },
    components: {
        MdPreview,
    },
    data() {
        return {
            resize: false,
            editor: '',
            editorWidth: null,
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
        printPath() {
            let path = this.path
            if (path) {
                path = path.split('/')
                path = _.last(path)
            }
            return path
        },
    },
    methods: {
        ...mapActions('markdown', ['loadMarkdown', 'saveMarkdown']),
        async onLoad() {
            const { path } = this
            try {
                this.editor = _.toString(null)
                const { data } = await this.loadMarkdown({ path })
                this.editor = _.toString(data)
            } catch (e) {
                console.error(e)
            }
        },
        onMouseMove(event) {
            this.$nextTick(() => {
                if (this.resize == false) {
                    return
                }
                const { card, editor } = this.$refs
                const domRect = editor.getBoundingClientRect()
                const maxWidth = card.$el.clientWidth - 100
                // event 없이 접근시 넓이 고정
                if (!event) {
                    this.editorWidth = maxWidth
                    return
                }
                let x = event.x
                // 좌측 사이드바가 열려있는 경우 그 폭만큼 빼준다.
                if (this.$app.drawer) {
                    x = event.x - domRect.x
                }
                if (x > maxWidth) {
                    this.editorWidth = maxWidth
                    return
                }
                this.editorWidth = x
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
$rowHeader: 36px;
$rowFooter: 48px;
.md-editor-page::v-deep {
    height: calc(100vh - var(--app-header-height));
    .card-md {
        border: 1px solid var(--theme-color-2);
    }
    .row-md-header {
        height: $rowHeader;
        flex-shrink: 0;
        .text-title {
            font-size: 14px;
        }
    }
    .row-md-footer {
        height: $rowFooter;
        flex-shrink: 0;
        .btn-md-save {
            background: var(--theme-color-g1);
        }
    }
    .row-md-content {
        height: calc(100% - $rowHeader - $rowFooter);
        overflow-x: hidden;
        .md-left-panel {
            .md-editor {
                background: rgba(246, 246, 246);
                height: 100%;
                font-family: 'Monaco', courier, monospace;
                font-size: 14px;
                border: none;
                resize: none;
                outline: none;
            }
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
                border-left: 1.5px dotted var(--theme-color-2);
                cursor: col-resize;
                .btn-md-resizer {
                    position: absolute;
                    top: 50%;
                    left: -29px;
                }
            }
        }
    }
}
</style>
