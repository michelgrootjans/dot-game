const GameCreated = (options) => ({...options, timestamp: Date.now(), type: 'GameCreated'})

module.exports = {
  GameCreated
}