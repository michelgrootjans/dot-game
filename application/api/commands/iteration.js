const StartIteration = (gameId, iterationId) => {
  return {type: 'StartIteration', gameId, iterationId}
}
const EndIteration = (gameId, iterationId) => {
  return {type: 'EndIteration', gameId, iterationId}
}

module.exports = {
  StartIteration,
  EndIteration
}