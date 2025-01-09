const { v4: uuid } = require('uuid')

const CreateGame = (options) => {
  return ({
    gameId: uuid(),
    ...options,
    type: 'CreateGame',
  });
}

module.exports = {
  CreateGame,
}
