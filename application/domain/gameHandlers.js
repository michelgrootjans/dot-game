const {GameCreated} = require('../api/events/game');
const initialState = require("./initial-state");

const CreateGameHandler = (games, publish) => ({
  execute: ({gameId}) => {
    if(games.find(gameId)) return;

    const newGame = initialState()
    const game = {...newGame, gameId};
    games.add(game)
    publish(GameCreated(game));
  }
});

module.exports = {CreateGameHandler}