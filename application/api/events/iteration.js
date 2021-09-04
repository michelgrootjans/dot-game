const IterationStarted = (options) => ({...options, type: 'IterationStarted'})
const IterationFinished = (options) => ({...options, type: 'IterationFinished'})

module.exports = {
  IterationStarted,
  IterationFinished
}