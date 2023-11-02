<template>
    <v-navigation-drawer
        clipped
        app
        mobile-breakpoint="0"
        :value="value"
        class="app-drawer"
        @input="onInput"
    >
        <v-row class="row-category" no-gutters>
            <v-col>
                <v-tabs-items v-model="selectedTab">
                    <v-tab-item
                        v-for="(tab, i) in tabs"
                        :key="`drawer-tab-item-${i}`"
                    >
                        <app-category
                            v-bind="
                                isCategory(tab)
                                    ? getCategory
                                    : getCategoryByFile
                            "
                        />
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
        <v-divider />
        <v-row class="row-drawer-tabs" center-active grow no-gutters>
            <v-col>
                <v-tabs
                    v-model="selectedTab"
                    class="drawer-tabs"
                    active-class="active"
                    :color="$app.scss('--theme-color')"
                >
                    <v-tab
                        v-for="(tab, i) in tabs"
                        :key="`drawer-tab-${i}`"
                        :style="{ width: 100 / tabs.length + '%' }"
                        ><b>{{ tab.label }}</b></v-tab
                    >
                </v-tabs>
            </v-col>
        </v-row>
    </v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex'
import AppCategory from '@/layouts/AppCategory.vue'
export default {
    name: 'AppDrawer',
    components: {
        AppCategory,
    },
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            items: [],
            selectedTab: null,
            tabs: [
                {
                    label: '모든파일',
                    value: 'file',
                },
                {
                    label: '카테고리',
                    value: 'category',
                },
            ],
        }
    },
    computed: {
        ...mapGetters('category', ['getCategory', 'getCategoryByFile']),
    },
    methods: {
        isCategory({ value } = {}) {
            return value == 'category'
        },
        onInput(value) {
            this.$emit('input', value)
        },
    },
    mounted() {},
}
</script>
<style lang="scss" scoped>
.app-drawer::v-deep {
    height: 100%;
    .row-category {
        height: 95%;
    }
    .row-drawer-tabs {
        height: 5%;
        width: 100%;
        .drawer-tabs {
            .active {
                background-color: var(--theme-color);
                opacity: 0.9;
                b {
                    color: #fff;
                }
            }
        }
    }
}
</style>
