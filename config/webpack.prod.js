var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  // devtool: 'source-map',

  output: {
    path: helpers.root('../app/assets/webpack/'),
    publicPath: '/assets/',
    filename: 'webpack-bundle.js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  htmlLoader: {
    minimize: false
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // Don't beautify output (enable for neater output)
      beautify: false,
      // Eliminate comments
      comments: false,
      // Compression specific options
      compress: {
        warnings: false,
        // Drop 'console' statements
        drop_console: false
      },
      // Mangling specific options
      mangle: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(ENV)
      }
    })
  ]
});
