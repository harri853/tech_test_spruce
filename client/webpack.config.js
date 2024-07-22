const HtmlWebpackPlugin = require('html-webpack-plugin');
const tailwindcss = require('tailwindcss');
const webpack = require('webpack');
const path = require('path');

module.exports = (env) => ({
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'source-map',
  output: {
    publicPath: '/',
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(webp|jpe?g|svg|png)$/i,
        loader: 'file-loader'
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [tailwindcss]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html') // Correctly specify the path to index.html
    }),
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3002,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
