var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//https://github.com/keokilee/react-typescript-boilerplate

var APP_DIR = path.join(__dirname, 'src');

var config = {
  entry: {
    app: './src/webclient/index.tsx',
    lib: ['react', 'react-router']
  },
  output: {
    path: __dirname + '/build/webclient/assets/js',
    filename: 'app.js',
    publicPath: '/assets/js/'
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
      loader: ExtractTextPlugin.extract("style", "css", "autoprefixer-loader?browsers=last 2 version", "sass-loader")
    }]
  },
  ts: {
    compiler: 'typescript'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("lib", 'lib.js'),
    new webpack.BannerPlugin('Build: '+new Date()),
    new ExtractTextPlugin('../css/app.css', {
       publicPath: '/assets/css/',
       allChunks: true
     })
  ].concat(!process.env.NODE_ENV || process.env.NODE_ENV === 'production'
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
  }
}

if (process.env.NODE_ENV === 'development') {
  config.devtool = "#source-map";
}

module.exports = config;
