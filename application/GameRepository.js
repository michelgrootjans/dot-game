const Game = require("./domain/Game");

const GameRepository = () => {
  let games = [];

  const add = game => games = [...games, game];
  const find = gameId => {
    const game = games.find(game => game.gameId === gameId);
    if (game) {
      return Game(game);
    }
  };
  const findColumn = (a, b) => console.log(a, b);
  return {
    add,
    find,
    findColumn
  }
};

module.exports = GameRepository