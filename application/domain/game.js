const {GameCreated} = require('../api/events/game');
const {initialState} = require("./state");

const CreateGame = (games, publish) => ({
  execute: ({gameId}) => {
    const newGame = initialState()
    const game = {...newGame, gameId};
    games.add(game)
    publish(GameCreated(game));
  }
});

module.exports = {CreateGame}