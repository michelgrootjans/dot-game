const GameCreated = ({gameId}) => {
  return {type: 'GameCreated', gameId}
}

module.exports = {
  GameCreated
}