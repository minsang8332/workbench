const path = require('path')
const dotenv = require('dotenv')
const { EnvironmentPlugin } = require('webpack')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const ElectronReloadPlugin = require('webpack-electron-reload')({
    path: path.join(__dirname, './build/bundle.js'),
})
module.exports = (env) => {
    const config = dotenv.config({
        path: '.env',
    })
    let externals = {}
    if (config && config?.parsed?.NATIVE_NODE_MODULES) {
        externals = config?.parsed?.NATIVE_NODE_MODULES.split(',').reduce((acc, nodeModule) => {
            acc[nodeModule] = `commonjs ${nodeModule}`
            return acc
        }, {})
    }
    const commonWebpack = {
        mode: env.production ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, './src/'),
            },
        },
    }
    const mainWebpack = Object.assign({}, commonWebpack, {
        target: 'electron-main',
        entry: path.resolve(__dirname, 'src', 'main.ts'),
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'build'),
        },
        externals,
        plugins: [new EnvironmentPlugin({ ...config.parsed })],
    })
    const preloadWebpack = Object.assign({}, commonWebpack, {
        target: 'electron-preload',
        entry: path.resolve(__dirname, 'src', 'preload.ts'),
        output: {
            filename: 'preload.js',
            path: path.resolve(__dirname, 'build'),
        },
        plugins: [],
        externals,
    })
    const fileManagerPlugin = new FileManagerPlugin({
        events: {
            onEnd: {
                copy: [
                    {
                        source: path.resolve(__dirname, 'src', 'assets'),
                        destination: path.resolve(__dirname, 'build', 'assets'),
                    },
                    {
                        source: path.resolve(__dirname, 'webview', 'dist'),
                        destination: path.resolve(__dirname, 'build', 'dist'),
                    },
                ],
            },
        },
    })
    if (mainWebpack.target == 'electron-main') {
        mainWebpack.plugins.push(fileManagerPlugin)
    }
    const electronReloadPlugin = ElectronReloadPlugin()
    if (!env.production) {
        mainWebpack.plugins.push(electronReloadPlugin)
    }
    return [mainWebpack, preloadWebpack]
}
