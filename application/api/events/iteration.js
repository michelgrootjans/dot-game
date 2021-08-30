const IterationStarted = (gameId, iterationId, duration) => {
  return {type: 'IterationStarted', gameId, iterationId, duration}
}
const IterationFinished = (gameId, iterationId) => {
  return {type: 'IterationFinished', gameId, iterationId}
}

module.exports = {
  IterationStarted,
  IterationFinished
}