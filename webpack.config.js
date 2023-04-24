const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');
const pathFileDinymic = (path) => {
  return glob.sync(path).reduce((entries, entry) => {
    const key = entry.replace('./src/ts/', '').replace(/\.js$/, '').split('\\').at(-1).split('.ts').join('')
    const value = './' + entry.split('\\').join('/').toString();
    return {
      [key]: value
    };
  }, {})
}
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: true, // отключаем минификацию
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // настраиваем опции для Terser
          compress: false,
          mangle: false,
        },
      }),
    ],
  },
  entry: {
    background: './src/background/background.ts',
    popup: './src/popup/popup.ts',
    popupVisual: './src/popup/popupVisual.ts',
    ...pathFileDinymic('./src/content/**/*.ts')
  },
  output: {
    path: path.resolve(__dirname, 'extensionsNeolant'),
    filename: '[name].js',
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
        exclude: [
          path.resolve(__dirname, 'src/content'),
        ],
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src/content'),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__ex'
              }
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/manifest.json',
        to: 'manifest.json'
      }, ],
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/images',
        to: 'images'
      }, ],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup/popup.html',
      chunks: ['popup', 'popupVisual'],
      path: path.resolve(__dirname, 'extensionsNeolant'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    })
  ]
}

