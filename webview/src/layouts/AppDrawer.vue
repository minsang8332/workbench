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
                    <md-category
                        :title="`전체 (${cntMarkdowns})`"
                        is-dir
                        :items="getMarkdownTree"
                        class="pa-2"
                    />
                </v-col>
            </v-row>
            <v-row class="row-footer" no-gutters>
                <v-col>
                    <v-divider />
                    <!-- @TODO 파일 검색 -->
                    <v-btn class="btn-adf-search" depressed tile block> </v-btn>
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
}
</script>
<style lang="scss" scoped>
.app-drawer::v-deep {
    $rowFooter: 48px;
    height: 100%;
    .card-app-drawer {
        position: relative;
        height: 100%;
        .row-category {
            height: calc(100vh - 96px);
            overflow: scroll;
        }
        .row-footer {
            position: absolute;
            height: $rowFooter;
            bottom: 0;
            width: 100%;
            .btn-adf-search {
                background: var(--theme-color-g1);
                height: 100%;
            }
        }
    }
}
</style>
