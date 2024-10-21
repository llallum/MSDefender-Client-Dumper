const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        index : './src/devtools/index.tsx',
        devtools: './src/devtools/devtools.ts',
        panel: './src/devtools/panel.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/devtools.html',
            filename: 'devtools.html',
            chunks: ['devtools']
        }),
        new HtmlWebpackPlugin({
            template: './src/panel.html',
            filename: 'panel.html',
            chunks: ['panel']
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve('manifest.json'),
                to: path.resolve('dist')
            }]
        })
    ],
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {'runtime': 'automatic'}],
                            '@babel/preset-typescript'
                        ]}}
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
}