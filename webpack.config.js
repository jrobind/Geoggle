const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/scripts/index.js',
    output: {
        path: '/',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {test: /\.(js)$/, use: 'babel-loader', exclude: /node_modules/},
            {test: /\.scss$/, use: [
                {loader: 'style-loader'}, 
                {loader: 'css-loader'},
                {loader: 'sass-loader'}
            ]},
            {test: /\.(png|jpg)$/, loader: 'url-loader?linit=8192'}
        ]
    },
    devtool: 'source-map',
    plugins: [new HtmlWebpackPlugin({
        template: './index.html'
    })],
    mode: 'development'
}