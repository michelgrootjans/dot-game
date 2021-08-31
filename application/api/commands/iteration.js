const StartIteration = ({gameId}) => ({type: 'StartIteration', gameId})
const EndIteration = ({gameId}) => ({type: 'EndIteration', gameId})

module.exports = {
  StartIteration,
  EndIteration
}
