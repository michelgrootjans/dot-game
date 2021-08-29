const IterationStarted = (gameId, iterationId) => {
  return {type: 'IterationStarted', gameId, iterationId}
}
const IterationFinished = (gameId, iterationId) => {
  return {type: 'IterationFinished', gameId, iterationId}
}

module.exports = {
  IterationStarted,
  IterationFinished
}