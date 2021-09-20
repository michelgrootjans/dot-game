const {GameCreated} = require('../api/events/game');
const initialState = require("./initial-state");

const CreateGameHandler = (games, publish) => ({
  execute: ({gameId}) => {
    if(games.find(gameId)) return;

    const game = {...initialState(), gameId};
    games.add(game)
    publish(GameCreated(game));
  }
});

module.exports = {CreateGameHandler}