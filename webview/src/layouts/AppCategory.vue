<template>
    <v-card class="app-category" :class="classListAppCategory" flat transparent>
        <v-row class="py-1" v-ripple no-gutters @click="show = !show">
            <v-col>
                <v-row no-gutters>
                    <v-col v-if="depth" class="text-right" :cols="depth">
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
            show: false,
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
                // 라벨은 없고 파일이 있는 경우
                if (!_.isNil(label) && this.isFile) {
                    return filename
                }
                // 라벨이 없고 하위 목록도 없는 경우
                if (!(_.isString(label) && items && items.length)) {
                    return print
                }
                print = `${label} (${items.length})`
            } catch (e) {
                console.error(e)
            }
            return print
        },
    },
}
</script>
