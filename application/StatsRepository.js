const StatsRepository = () => {
  const stats = [];

  return {
    push: item => stats.push(item),
    find: (predicate) => stats.find(predicate),
    findStats: gameId => stats.find(s => s.gameId === gameId)
  };
};

module.exports = StatsRepository;