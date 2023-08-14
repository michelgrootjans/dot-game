const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'dot-game': './web/src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'web', 'dist'),
  },
}
