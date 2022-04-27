const {GameCreated} = require('../api/events/game');
const initialState = require("./initial-state");

const CreateGameHandler = (games, publish) => ({
  execute: ({gameId, state = initialState()}) => {
    if(games.find(gameId)) return;

    state.columns = state.columns.map(c => ({...c, numberOfAssignments: 0}))
    const game = {...state, gameId};
    games.add(game)
    publish(GameCreated(game));
  }
});

module.exports = {CreateGameHandler}