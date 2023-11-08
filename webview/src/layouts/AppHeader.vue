<template>
    <v-app-bar
        class="app-header native-drag bg-theme-g1"
        app
        :height="$app.scss('--app-header-height')"
        hide-overlay
        clipped-left
        elevate-on-scroll
    >
        <v-row no-gutters>
            <v-col>
                <v-btn
                    class="skip-native-drag"
                    text
                    tile
                    dark
                    plain
                    @click="$app.drawer = !$app.drawer"
                >
                    <v-icon>fa-solid fa-bars</v-icon>
                </v-btn>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="skip-native-drag"
                            text
                            tile
                            dark
                            :color="$app.scss('--folder-color')"
                            v-bind="attrs"
                            v-on="on"
                            @click="onOpenDir"
                        >
                            <v-icon>fa-solid fa-folder</v-icon>
                        </v-btn>
                    </template>
                    <p class="white--text">백업 폴더</p>
                </v-tooltip>
            </v-col>
            <v-col align="right">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            class="skip-native-drag"
                            :color="$app.scss('--theme-color-1')"
                            text
                            tile
                            dark
                            v-bind="attrs"
                            v-on="on"
                            @click="onPowerOff"
                        >
                            <v-icon>fa-solid fa-power-off</v-icon>
                        </v-btn>
                    </template>
                    <p class="white--text">종료</p>
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
        onPowerOff() {
            this.$store.dispatch('app/powerOff')
        },
    },
}
</script>
<style lang="scss" scoped>
.app-header::v-deep {
    .v-toolbar__content {
        padding: 0 4px;
    }
}
</style>
