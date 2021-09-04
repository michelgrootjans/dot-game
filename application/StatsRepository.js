const StatsRepository = () => {
  const stats = [];

  return {
    push: item => stats.push(item),
    find: gameId => stats.find(s => s.gameId === gameId),
    findStats: gameId => stats.find(s => s.gameId === gameId)
  };
};

module.exports = StatsRepository;