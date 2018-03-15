const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin =  require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader','css-loader','postcss-loader','sass-loader'];
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    {loader: 'css-loader', options: {sourceMap: true}}, 
    {loader: 'postcss-loader', options: {sourceMap: true}}, 
    {loader: 'sass-loader', options: {sourceMap: true}} 
  ]
})
const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
  entry: {
    main: './src/js/app.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConfig/*,
        use: ['style-loader','css-loader','postcss-loader','sass-loader']
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true}}, 
            {loader: 'postcss-loader', options: {sourceMap: true}}, 
            {loader: 'sass-loader', options: {sourceMap: true}} 
          ]
        })*/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProd
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Webpack Starter Boilerplate',
      minify: {
        collapseWhitespace: true
      },
      template: './src/views/index.html',
      chunks: ['main']
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:8080/)
        // through BrowserSync
        proxy: 'http://localhost:8080/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    )
  ]
}