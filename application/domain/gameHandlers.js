const { GameCreated } = require('../api/events/game')
const initialState = require('./initial-state')
const {DEFAULT_TASK_NAMES} = require("./defaults");

const hasValue = (text) => {
  if(!text) return false;
  return text.trim().length > 0;
};

const CreateGameHandler = (games, publish) => ({
  execute: ({ gameId, state, taskNames = DEFAULT_TASK_NAMES }) => {
    if (games.find(gameId)) return

    const newState = state || initialState({taskNames: taskNames.filter(hasValue)});

    const game = { ...newState, gameId }
    games.add(game)
    publish(GameCreated(game))
  },
})

module.exports = { CreateGameHandler }
