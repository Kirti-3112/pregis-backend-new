const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'production',
  target: 'node', // important for building a Node.js application
  entry: './src/index.js', // your main entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // output bundle file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  externals: [nodeExternals()], // ignore node_modules when bundling
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new Dotenv({
      path: path.resolve(__dirname, '.env'), // Path to your .env file
      safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false, // load '.env.defaults' as the default values if empty.
    }),
  ],
};
