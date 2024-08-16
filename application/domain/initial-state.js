const fourPlayers = require('./initial-4-player-state')
const fivePlayers = require('./initial-5-player-state')

const initialState = (numberOfPlayers = 5) => {
  if (numberOfPlayers === 4 || numberOfPlayers === '4') {
    return fourPlayers()
  } else {
    return fivePlayers()
  }
}

module.exports = initialState
