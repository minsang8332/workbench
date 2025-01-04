import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteSingleFile } from 'vite-plugin-singlefile'
const plugins: any = [vue(), vueJsx()]
if (process.env.NODE_ENV == 'production') {
    plugins.push(viteSingleFile())
}
export default defineConfig({
    server: {
        port: 8080
    },
    plugins,
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
