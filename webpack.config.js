const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.map$/,
        use: 'ignore-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.ts'],
    fallback: {
      "http": require.resolve("stream-http"),
      "path": require.resolve("path-browserify"),
      "fs": false // fs is not available in browser context
    }
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  target: 'node', // Set the target to node for server-side code

  devServer: {
    contentBase: path.join(__dirname, ''),
    compress: true,
    port: 9000,
    hot: true,
  },
};
