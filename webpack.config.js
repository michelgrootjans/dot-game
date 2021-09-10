const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'dot-game-board': './web/src/board.js',
    'dot-game-work': './web/src/work.js',
  },
  output: {
    path: path.resolve(__dirname, 'web', 'dist'),
  },
};
