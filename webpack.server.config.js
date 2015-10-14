var path = require('path');

module.exports = {
  entry: [
    './src/server/index.ts',
  ],
  output: {
    path: __dirname + '/build',
    filename: 'server.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.tsx?$/, loaders: ['babel', 'ts'] }
    ]
  },
  ts: {
    compiler: 'typescript'
  },
  plugins: [
  ],
  devtool: "#source-map",
  target: "node",
  node: {
    net: "empty",
    tls: "empty",
    'pg-native': "empty",
    dns: "empty",
    fs: "empty"
  }
}
