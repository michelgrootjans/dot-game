const StartIteration = ({gameId, duration}) => ({type: 'StartIteration', gameId, duration})
const EndIteration = ({gameId}) => ({type: 'EndIteration', gameId})

module.exports = {
  StartIteration,
  EndIteration
}
