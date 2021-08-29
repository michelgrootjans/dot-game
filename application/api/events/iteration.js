const IterationStarted = (iterationId) => {
  return {type: 'IterationStarted', iterationId}
}
const IterationFinished = (iterationId) => {
  return {type: 'IterationFinished', iterationId}
}

module.exports = {
  IterationStarted,
  IterationFinished
}