const IterationStarted = (gameId, iterationId) => {
  return {type: 'IterationStarted', gameId, iterationId, duration: 5000}
}
const IterationFinished = (gameId, iterationId) => {
  return {type: 'IterationFinished', gameId, iterationId}
}

module.exports = {
  IterationStarted,
  IterationFinished
}