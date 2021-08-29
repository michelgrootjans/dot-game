const StartIteration = (iterationId) => {
  return {type: 'StartIteration', iterationId}
}
const EndIteration = (iterationId) => {
  return {type: 'EndIteration', iterationId: iterationId}
}

module.exports = {
  StartIteration,
  EndIteration
}