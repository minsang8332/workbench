<template>
    <v-app-bar
        class="app-header"
        app
        dense
        hide-overlay
        clipped-left
        elevate-on-scroll
    >
        <v-row no-gutters>
            <v-col>
                <v-btn text fab dark plain @click="$app.drawer = !$app.drawer">
                    <v-icon>fa-solid fa-bars</v-icon>
                </v-btn>
            </v-col>
            <v-col align="right">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            text
                            fab
                            dark
                            v-bind="attrs"
                            v-on="on"
                            @click="onOpenDir"
                        >
                            <v-icon>fa-solid fa-folder</v-icon>
                        </v-btn>
                    </template>
                    <p class="white--text">문서 열람</p>
                </v-tooltip>
            </v-col>
        </v-row>
    </v-app-bar>
</template>
<script>
export default {
    name: 'AppHeader',
    methods: {
        onOpenDir() {
            this.$store.dispatch('markdown/openMarkdownDir')
        },
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/app.scss';
.app-header {
    background: $theme !important;
}
</style>
