var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    //devtool: 'eval-source-map',

    entry: [
      'es5-shim/es5-shim',
      'es5-shim/es5-sham',
      'babel-polyfill',
      './app/registration'
    ],


    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    module: {
        loaders: [{
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=public/[name].[ext]'
            },

            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new ExtractTextPlugin('[name].css')
    ]
};
