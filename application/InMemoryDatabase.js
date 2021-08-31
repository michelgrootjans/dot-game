const InMemoryDatabase = () => {
  let games = [];

  const add = game => games = [...games, game];
  const find = gameId => games.find(game => game.gameId === gameId);
  return {
    add,
    find
  }
};

module.exports = InMemoryDatabase