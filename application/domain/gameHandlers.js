const { GameCreated } = require('../api/events/game')
const initialState = require('./initial-state')
const {DEFAULT_TASK_NAMES} = require("./defaults");

const hasValue = (text) => {
  if(!text) return false;
  return text.trim().length > 0;
};

const CreateGameHandler = (games, publish) => ({
  execute: (options) => {
    const gameId = options.gameId
    const title = options.title || 'The Dot Game'
    const taskNames = options.taskNames === undefined ? DEFAULT_TASK_NAMES : options.taskNames
    if (games.find(gameId)) return

    const newState = options.state || initialState({title, taskNames: taskNames.filter(hasValue)});

    const game = { ...newState, gameId, title }
    games.add(game)
    publish(GameCreated(game))
  },
})

module.exports = { CreateGameHandler }
