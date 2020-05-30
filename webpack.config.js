const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  mode: NODE_ENV,

  entry: {
    index: './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].build.js',
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100,
  },

  devtool: NODE_ENV === 'development' ? 'source-map' : false,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(xml)$/,
        use: {
          loader: 'file-loader?name=/xml/[name].[ext]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
};
