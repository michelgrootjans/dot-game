const StatsRepository = () => {
  const stats = [];

  const add = item => stats.push(item);
  const find = (gameId, iterationId) => {
    if (iterationId) {
      console.log('StatsRepository.find ', {iterationId})
      return stats.find(s => s.iterationId === iterationId);
    } else {
      console.log('StatsRepository.find ', {gameId})
      return stats.find(s => s.gameId === gameId);
    }
  };

  return {
    add,
    find,
  };
};

module.exports = StatsRepository;