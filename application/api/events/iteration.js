const IterationStarted = (gameId, duration = 5000) => {
  return {type: 'IterationStarted', gameId, duration}
}
const IterationFinished = (gameId) => {
  return {type: 'IterationFinished', gameId}
}

module.exports = {
  IterationStarted,
  IterationFinished
}