const Game = require("./domain/Game");

const InMemoryDatabase = () => {
  let games = [];

  const add = game => games = [...games, game];
  const find = gameId => {
    const game = games.find(game => game.gameId === gameId);
    if (game) {
      return Game(game);
    }
  };
  return {
    add,
    find
  }
};

module.exports = InMemoryDatabase