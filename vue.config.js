// Prepare compressed versions of assets to serve them with Content-Encoding.
// More details: https://www.npmjs.com/package/compression-webpack-plugin
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionPlugin() // call plugin
    ]
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
