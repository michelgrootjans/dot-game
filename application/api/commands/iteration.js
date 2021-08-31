const StartIteration = (gameId, iterationId, duration = 5000) => {
  return {type: 'StartIteration', gameId, iterationId, duration}
}
const EndIteration = (gameId, iterationId) => {
  return {type: 'EndIteration', gameId, iterationId}
}

module.exports = {
  StartIteration,
  EndIteration
}