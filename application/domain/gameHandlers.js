const { GameCreated } = require('../api/events/game')
const initialState = require('./initial-state')

const CreateGameHandler = (games, publish) => ({
  execute: ({ gameId, state, numberOfPlayers = 5 }) => {
    if (games.find(gameId)) return

    let newState = state || initialState(numberOfPlayers)

    const game = { ...newState, gameId }
    games.add(game)
    publish(GameCreated(game))
  },
})

module.exports = { CreateGameHandler }
