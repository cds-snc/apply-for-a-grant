const path = require('path')

module.exports = (env, argv) => {
  const { getConfig } = require('@cds-snc/webpack-starter')

  return (config = getConfig({
    entry: {
      personal: './src/personal.js',
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'public/js/dist'),
    },
    HtmlWebpackPluginOptions: {},
  }))
}
