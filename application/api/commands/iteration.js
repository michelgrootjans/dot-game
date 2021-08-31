const StartIteration = (input) => ({...input, type: 'StartIteration'})
const EndIteration = (input) => ({...input, type: 'EndIteration'})

module.exports = {
  StartIteration,
  EndIteration
}
