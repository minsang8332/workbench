<template>
    <v-card
        v-if="depth >= 0 && depth <= maxDepth"
        class="md-category"
        :class="classListAppCategory"
        flat
        transparent
    >
        <v-row
            v-ripple
            no-gutters
            @mouseup.right="onRightClick"
            @dblclick="onDbClick"
            @click="show = !show"
        >
            <v-col>
                <v-row no-gutters draggable>
                    <v-col v-if="depth > 0" class="text-right" :cols="depth">
                        <v-icon
                            v-if="isDir"
                            :color="$app.scss('--dark-color')"
                            small
                        >
                            mdi-chevron-right
                        </v-icon>
                    </v-col>
                    <v-col class="text-truncate">
                        <v-icon
                            v-if="isDir"
                            class="mr-1"
                            small
                            :color="$app.scss('--folder-color')"
                        >
                            fa-solid fa-folder
                        </v-icon>
                        <v-icon
                            v-else
                            class="mr-1"
                            small
                            :color="$app.scss('--dark-color')"
                        >
                            mdi-file-document-outline
                        </v-icon>
                        <b class="text-title">{{ printTitle }}</b>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <transition name="slide">
            <v-row v-if="items && items.length > 0 && show" no-gutters>
                <v-col>
                    <md-category
                        v-for="(item, i) of items"
                        v-bind="item"
                        :depth="depth + 1"
                        :key="`item-${i}`"
                    />
                </v-col>
            </v-row>
        </transition>
    </v-card>
</template>
<script>
import _ from 'lodash'
export default {
    name: 'MdCategory',
    props: {
        title: {
            type: [String, null],
            default: null,
        },
        path: {
            type: [String, null],
            default: null,
        },
        items: {
            type: [Object, Array, null, undefined],
            default: () => [],
        },
        isDir: {
            type: [Boolean],
            default: false,
        },
        depth: {
            type: [Number],
            default: 0,
        },
        maxDepth: {
            type: [Number],
            default: 5,
        },
    },
    data() {
        return {
            show: true,
        }
    },
    computed: {
        classListAppCategory() {
            let classList = []
            if (this.isFile) {
                classList.push('file')
            } else {
                classList.push('category')
            }
            return classList
        },
        printTitle() {
            let print
            try {
                const { title, items } = this
                print = title
                if (_.isArray(items)) {
                    // print += ` (${items.length})`
                }
            } catch (e) {
                console.error(e)
            }
            return print
        },
    },
    methods: {
        // 우측 마우스 클릭시 메뉴 모달
        onRightClick(event) {
            const { path, isDir } = this
            this.$app.showMenu({
                pageX: event.pageX,
                pageY: event.pageY,
                path,
                isDir,
            })
        },
        // 좌측 더블 클릭시 문서보기
        onDbClick() {
            const { path, isDir } = this
            if (!path) {
                return
            }
            if (isDir) {
                return
            }
            this.$router
                .replace({ name: 'markdown', params: { path } })
                .catch((e) => e)
        },
    },
}
</script>
<style scoped lang="scss">
.text-title {
    font-size: 16px;
    font-family: 'D2Coding';
}
</style>
