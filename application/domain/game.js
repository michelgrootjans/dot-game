const {GameCreated} = require('../api/events/game');
const {initialState} = require("./state");

const CreateGame = (games, publish) => ({
  execute: command => {
    const newGame = initialState()
    const game = {...newGame, gameId: command.gameId};
    games.add(game)
    publish(GameCreated(game));
  }
});

module.exports = {CreateGame}