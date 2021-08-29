const {GameCreated} = require('../api/events/game');

const initialGame = {iterations: []};
const CreateGame = (games, publish) => ({
  execute: command => {
    const game = {...initialGame, gameId: command.gameId};
    games.add(game)
    publish(GameCreated(game));
  }
});

module.exports = {CreateGame}