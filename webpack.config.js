const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  let entry, minimize

  if (env && env.minimize) {
    entry = {
      'quill-qtable.min.js': ['./src/quill-qtable.js']
    }
    minimize = true
  } else {
    entry = {
      'quill-qtable.js': ['./src/quill-qtable.js'],
      'quill-qtable': './src/assets/quill-qtable.scss',
      'demo/demo1.js': './demo/js/demo1.js'
    }
    minimize = false
  }

  return {
    entry,

    optimization: {
      minimize
    },

    output:{
      filename: '[name]',
      library: 'quillQTable',
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, './dist/')
    },

    resolve: {
      alias: {
        'src': path.resolve(__dirname, './src'),
        'dist': path.resolve(__dirname, './dist')
      },
      extensions: ['.js', '.scss', '.html']
    },

    externals: {
      'quill': {
        commonjs: 'quill',
        commonjs2: 'quill',
        amd: 'quill',
        root: 'Quill'
      }
    },

    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png)$/,
          include: [
            path.resolve(__dirname, '../src/assets/imgs')
          ],
          use: [{
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }]
        },

        {
          test: /\.(html|svg)$/,
          use: [{
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }]
        },

        {
          test: /\.scss$/,
          use: [
            // fallback to style-loader in development
            !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },

        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    targets: {
                      browsers: [
                        'last 2 Chrome major versions',
                        'last 2 Firefox major versions',
                        'last 2 Safari major versions',
                        'last 2 Edge major versions',
                        'last 2 iOS major versions',
                        'last 2 ChromeAndroid major versions',
                      ],
                    },
                  }
                ]
              ]
            }
          }
        }
      ]
    },

    plugins:[
      new HtmlWebpackPlugin({
        title:'quill-qtable',
        template:'./demo/demo1.html',
        filename:'demo/demo1.html',
      }),

      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].[id].css'
      }),

      new webpack.HotModuleReplacementPlugin({})
    ],

    devServer:{
      host:'localhost',
      static: path.join(__dirname, './dist'),
      port: 8080,
      hot: false
    }
  }
}
