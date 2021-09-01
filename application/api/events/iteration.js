const IterationStarted = ({gameId, duration = 5000}) => ({type: 'IterationStarted', gameId, duration})
const IterationFinished = ({gameId}) => ({type: 'IterationFinished', gameId})

module.exports = {
  IterationStarted,
  IterationFinished
}