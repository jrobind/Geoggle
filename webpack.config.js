const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ['babel-polyfill', './src/scripts/index.js'],
    output: {
        path: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {test: /\.(js)$/, use: 'babel-loader', exclude: /node_modules/},
            {test: /\.scss$/, use: ExtractTextPlugin.extract({
                use: ['css-loader', 'sass-loader']
            })}
        ]
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new ExtractTextPlugin('styles.css')
    ],
    mode: 'development'
}