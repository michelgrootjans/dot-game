const StartIteration = (input) => {
  return {...input, type: 'StartIteration'}
}
const EndIteration = (input) => {
  return {...input, type: 'EndIteration'}
}

module.exports = {
  StartIteration,
  EndIteration
}
