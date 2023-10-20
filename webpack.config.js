const path = require('path')
const ElectronReloadPlugin = require('webpack-electron-reload')({
    path: path.join(__dirname, './build/bundle.js'),
})
module.exports = (env) => {
    const commonWebpack = {
        mode: process.env.NODE_ENV,
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
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'build'),
        },
        plugins: [],
    }
    const mainWebpack = Object.assign({}, commonWebpack, {
        target: 'electron-main',
        entry: './src/app.ts',
        plugins: [ElectronReloadPlugin()],
    })

    return [mainWebpack]
}
