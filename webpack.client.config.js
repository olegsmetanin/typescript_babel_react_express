var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

//https://github.com/keokilee/react-typescript-boilerplate

var APP_DIR = path.join(__dirname, 'src');

var config = {
  entry: {
    main: './src/webclient/index.tsx',
    lib: ['react', 'react-router', 'redux', 'react-redux', 'redux-actions', 'redux-thunk', 'redux-promise-middleware', 'react-document-meta'],
    //about: './src/webclient/handlers/AboutHandler.tsx'
  },
  output: {
    path: __dirname + '/build/webpublic/static/js',
    filename: '[name].js',
    publicPath: '/static/js/'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ['component-css?ext=scss', 'babel', 'ts'],
      include: APP_DIR
    }, {
      test: /\.jsx?$/,
      loaders: ['component-css?ext=scss','babel'],
      include: APP_DIR
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!resolve-url!sass")
    }, {
      test: /\.woff2?$|\.ttf$|\.eot$/,
      loader: 'file-loader?name=../fonts/[name].[ext]'
    }, {
      test: /\.svg$/,
      loader: require.resolve('./webpacksvg-loader')
    }]
  },
  ts: {
    compiler: 'typescript'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("lib", 'lib.js'),
    new webpack.BannerPlugin('Build: '+new Date()),
    new ExtractTextPlugin(__dirname + '/build/webpublic/static/css/app.css', {
       publicPath: '/static/css/',
       allChunks: true
     })
  ].concat(process.env.NODE_ENV !== 'development'
    ? [new webpack.optimize.UglifyJsPlugin({
        compress: {
           warnings: false
        },
        minimize: true
      })]
    : []
  ),
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./src/webclient")]
  },
  postcss: function () {
    return [autoprefixer({ browsers: ['last 2 versions'] })];
  }
}

if (process.env.NODE_ENV === 'development') {
  config.devtool = "#source-map";
}

module.exports = config;
