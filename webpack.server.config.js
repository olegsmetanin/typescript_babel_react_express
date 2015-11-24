var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
//https://github.com/keokilee/react-typescript-boilerplate

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


var APP_DIR = path.join(__dirname, 'src');

var config = {
  entry: './src/server/index.ts',
  output: {
    path: __dirname + '/build/server',
    filename: 'server.js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
  },
  target: 'node',
  externals: nodeModules,
  module: {
    loaders: [{
      test: /\.tsx?$/,
      loaders: ['babel', 'ts'],
      include: APP_DIR
    }, {
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: APP_DIR
    }, {
      test: /\.json$/,
      loader: "json-loader"
    }]
  },
  ts: {
    compiler: 'typescript'
  },
  plugins: [
    new webpack.BannerPlugin('Build: ' + new Date()),
    //new webpack.ContextReplacementPlugin(/loadContainerAsync/, ''),
    new webpack.NormalModuleReplacementPlugin(/^bundle\?.*$/, function (result) {
      result.request = result.request.replace(/^bundle\?lazy&[^\!]*\!(.*)$/, "$1");
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV !== 'undefined'
          ? process.env.NODE_ENV
          : 'production'
        )
      }
    })
  ]
}

if (process.env.NODE_ENV === 'development') {
  config.devtool = "#source-map";
}

module.exports = config;
