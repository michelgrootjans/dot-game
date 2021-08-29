const CreateGame = (gameId) => {
  return {type: 'CreateGame', gameId}
}

module.exports = {
  CreateGame
}