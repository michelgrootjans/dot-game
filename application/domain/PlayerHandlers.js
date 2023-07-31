const JoinGameHandler = (games, publish) => {
  const execute = ({ columnId, gameId }) => {
    games.find(gameId).join(columnId)
    publish({ type: 'PlayerJoined', gameId, columnId })
  }
  return { execute }
}

const LeaveGameHandler = (games, publish) => {
  const execute = ({ columnId, gameId }) => {
    games.find(gameId).leave(columnId)
    publish({ type: 'PlayerLeft', gameId, columnId })
  }
  return { execute }
}

module.exports = { JoinGameHandler, LeaveGameHandler }
