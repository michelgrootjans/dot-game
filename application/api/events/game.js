const GameCreated = (game) => {
  return {type: 'GameCreated', gameId: game.gameId}
}

module.exports = {
  GameCreated
}