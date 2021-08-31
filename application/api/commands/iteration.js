const StartIteration = (gameId, duration = 5000) => {
  return {type: 'StartIteration', gameId, duration}
}
const EndIteration = (gameId) => {
  return {type: 'EndIteration', gameId}
}

module.exports = {
  StartIteration,
  EndIteration
}