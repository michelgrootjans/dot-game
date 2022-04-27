const JoinGame = (options) => ({...options, type: 'JoinGame'})
const LeaveGame = (options) => ({...options, type: 'LeaveGame'})

module.exports = {
  JoinGame,
  LeaveGame,
}