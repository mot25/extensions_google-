const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const glob = require('glob');
const pathFileDynamic = path => {
  const isWindows = os.platform() === 'win32';
  const pathObj = {};
  glob.sync(path).forEach(path => {
    const key = isWindows
      ? path.match(/\\([^\\]+)\.ts/)[1]
      : path.split('/').at(-1).split('.ts')[0];
    const value = './' + path.split('\\').join('/').toString();
    pathObj[key] = value;
  });
  return pathObj;
};
const moduleStyles = [
  path.resolve(__dirname, 'src/contentScripts'),
  path.resolve(__dirname, 'src/components')
];
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: false, // отключаем минификацию
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // настраиваем опции для Terser
          compress: false,
          mangle: false
        }
      })
    ]
  },
  entry: {
    background: './src/backgroundScripts/background.ts',
    popup: './src/popup/ui/popup.tsx',
    ...pathFileDynamic('./src/contentScripts/**/*.tsx'),
    ...pathFileDynamic('./src/contentScripts/**/*.ts')
  },
  output: {
    path: path.resolve(__dirname, 'extensionsNeolant'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack'
          }
        ]
      },
      {
        test: [/\.scss$/, /\.css$/],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: moduleStyles
      },
      {
        test: /\.scss$/,
        include: moduleStyles,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'extentions__[local]__[hash:base64:5]'
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
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json'
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/shared/assets/images',
          to: 'images'
        }
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/popup/index.html',
      chunks: ['popup'],
      path: path.resolve(__dirname, 'extensionsNeolant')
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss', '.svg'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
