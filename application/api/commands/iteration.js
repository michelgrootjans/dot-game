const StartIteration = (input) => {
  return {...input, type: 'StartIteration'}
}
const EndIteration = (gameId) => {
  return {type: 'EndIteration', gameId}
}

module.exports = {
  StartIteration,
  EndIteration
}
