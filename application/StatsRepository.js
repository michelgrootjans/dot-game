const StatsRepository = () => {
  const stats = [];

  const add =       item   => stats.push(item);
  const find =      gameId => stats.find(s => s.gameId === gameId);

  return {
    add,
    find,
  };
};

module.exports = StatsRepository;