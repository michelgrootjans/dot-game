const StatsRepository = () => {
  const stats = [];

  return {
    push: item => stats.push(item),
    findStats: gameId => stats.find(s => s.gameId === gameId)
  };
};

module.exports = StatsRepository;