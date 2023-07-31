const StartIteration = (options) => ({ ...options, type: 'StartIteration' })
const EndIteration = (options) => ({ ...options, type: 'EndIteration' })
const FindWork = (options) => ({ ...options, type: 'FindWork' })

module.exports = {
  StartIteration,
  EndIteration,
  FindWork,
}
