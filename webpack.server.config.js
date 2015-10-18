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
    modulesDirectories: ['node_modules'],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
  },
  externals: [
    {
      "./native": "null",
    }
  ],
  module: {
    loaders: [
      { test: /\.tsx?$/, exclude: /node_modules/, loaders: ['babel', 'ts-loader'] }
    ]
  },
  ts: {
    compiler: 'typescript'
  },
  plugins: [
  ],
  devtool: "#source-map",
  target: "node"
}
