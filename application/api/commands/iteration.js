const StartIteration = (options) => ({...options, type: 'StartIteration'})
const EndIteration = (options) => ({...options, type: 'EndIteration'})

module.exports = {
  StartIteration,
  EndIteration
}
