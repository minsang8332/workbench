<template>
    <v-navigation-drawer
        clipped
        app
        mobile-breakpoint="0"
        :value="value"
        class="app-drawer"
        @input="onInput"
    >
        <v-card class="card-app-drawer" tile flat>
            <v-row class="row-category" no-gutters>
                <v-col>
                    <v-tabs-items v-model="selectedTab">
                        <v-tab-item
                            v-for="(tab, i) in tabs"
                            :key="`drawer-tab-item-${i}`"
                        >
                            <md-category
                                :title="`전체 (${cntMarkdowns})`"
                                is-dir
                                :items="getMarkdownTree"
                                class="pa-2"
                            />
                        </v-tab-item>
                    </v-tabs-items>
                </v-col>
            </v-row>
            <v-row class="row-drawer-tabs" no-gutters>
                <v-col>
                    <v-divider />
                    <v-tabs
                        v-model="selectedTab"
                        class="drawer-tabs"
                        active-class="active"
                        height="48"
                        :color="$app.scss('--theme-color')"
                    >
                        <v-tab
                            v-for="(tab, i) in tabs"
                            :key="`drawer-tab-${i}`"
                            :style="{
                                width: 100 / tabs.length + '%',
                            }"
                            ><span class="text-tab">{{
                                tab.label
                            }}</span></v-tab
                        >
                    </v-tabs>
                </v-col>
            </v-row>
        </v-card>
    </v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex'
import MdCategory from '@/components/markdown/MdCategory.vue'
export default {
    name: 'AppDrawer',
    components: {
        MdCategory,
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
                    label: '',
                    value: 'category',
                },
            ],
        }
    },
    computed: {
        ...mapGetters('markdown', ['getMarkdownTree', 'cntMarkdowns']),
    },
    methods: {
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
    .card-app-drawer {
        position: relative;
        height: 100%;
        .row-category {
            height: calc(100vh - 96px);
            overflow: scroll;
        }
        .row-drawer-tabs {
            position: absolute;
            bottom: 0;
            width: 100%;
            .drawer-tabs {
                .active {
                    background: var(--theme-color-g1);
                    opacity: 0.9;
                    span {
                        color: #fff;
                    }
                }
                .text-tab {
                    font-family: 'NanumGothic';
                }
            }
            .v-tabs-slider-wrapper {
                display: none;
            }
        }
    }
}
</style>
