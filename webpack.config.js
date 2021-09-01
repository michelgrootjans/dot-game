const path = require('path');

module.exports = {
  entry: './web/src/index.js',
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'web', 'dist'),
  },
};
