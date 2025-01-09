const { GameCreated } = require('../api/events/game')
const initialState = require('./initial-state')
const {DEFAULT_TASK_NAMES} = require("./defaults");

const CreateGameHandler = (games, publish) => ({
  execute: ({ gameId, state, numberOfPlayers = 5, taskNames = DEFAULT_TASK_NAMES }) => {
    if (games.find(gameId)) return

    console.log({taskNames})
    let newState = state || initialState({numberOfPlayers: numberOfPlayers, taskNames: taskNames})

    const game = { ...newState, gameId }
    games.add(game)
    publish(GameCreated(game))
  },
})

module.exports = { CreateGameHandler }
