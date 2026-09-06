const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    hot: true,
    client: {
      overlay: {
        warnings: false,
        errors: true,
        runtimeErrors: true,
      },
    },
    proxy: [
      {
        context: ['/api'],
        target: 'https://bookstore.incubation.bridgelabz.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '/bookstore_user' },
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', options: { sassOptions: { quietDeps: true } } },
        ],
      },
    ],
  },
})
