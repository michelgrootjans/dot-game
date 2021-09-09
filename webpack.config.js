const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'dot-game-board': './web/src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'web', 'dist'),
  },
};
