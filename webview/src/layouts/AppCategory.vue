<template>
    <v-card
        v-if="depth && depth <= 3"
        class="app-category"
        :class="classListAppCategory"
        flat
        transparent
    >
        <v-row class="py-1" v-ripple no-gutters @click="show = !show">
            <v-col>
                <v-row no-gutters draggable>
                    <v-col class="text-right" :cols="depth">
                        <v-icon v-if="!isFile" color="#313131" small>
                            mdi-chevron-right
                        </v-icon>
                    </v-col>
                    <v-col class="text-truncate">
                        <v-icon
                            v-if="isFile"
                            class="mr-1"
                            color="#313131"
                            small
                        >
                            fa-regular fa-file
                        </v-icon>
                        <v-icon v-else class="mr-1" color="#FFE9A2" small>
                            fa-solid fa-folder
                        </v-icon>
                        <b class="text-label">{{ printLabel }}</b>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <transition name="slide">
            <v-row v-if="items && items.length > 0 && show" no-gutters>
                <v-col>
                    <app-category
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
    name: 'AppCategory',
    props: {
        label: {
            type: [String, null],
            default: null,
        },
        filename: {
            type: [String, null],
            default: null,
        },
        items: {
            type: [Object, Array, null, undefined],
            default: () => [],
        },
        depth: {
            type: [Number],
            default: 1,
        },
    },
    data() {
        return {
            show: true,
        }
    },
    computed: {
        isFile() {
            return _.isString(this.filename)
        },
        classListAppCategory() {
            let classList = []
            if (this.isFile) {
                classList.push('file')
            } else {
                classList.push('category')
            }
            return classList
        },
        printLabel() {
            let print
            try {
                const { label, items, filename } = this
                if (this.isFile) {
                    if (label) {
                        print = label
                    } else if (filename) {
                        print = filename
                    }
                } else {
                    // 카테고리 인 경우
                    if (label) {
                        print = label
                        if (_.isArray(items)) {
                            print += `(${items.length})`
                        }
                    }
                }
            } catch (e) {
                console.error(e)
            }
            return print
        },
    },
}
</script>
