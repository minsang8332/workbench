import _ from 'lodash'
import { type App } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
export default {
    install(app: App) {
        const vuetify = createVuetify({
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: {
                    mdi
                }
            },
            components,
            directives
        })
        app.use(vuetify)
    }
}
