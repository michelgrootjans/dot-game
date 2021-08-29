const InMemoryDatabase = () => {
  let games = [];

  return {
    add: game => games = [...games, game],
    find: gameId => games.find(game => game.gameId === gameId)
  }
};

module.exports = InMemoryDatabase