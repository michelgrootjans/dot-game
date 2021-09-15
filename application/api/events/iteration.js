const IterationStarted = (options) => ({...options, timestamp: Date.now(), type: 'IterationStarted'})
const IterationFinished = (options) => ({...options, timestamp: Date.now(), type: 'IterationFinished'})

module.exports = {
  IterationStarted,
  IterationFinished
}