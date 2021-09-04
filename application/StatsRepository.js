const StatsRepository = () => {
  const stats = [];

  return {
    push: item => stats.push(item),
    find: (predicate) => stats.find(predicate)
  };
};

module.exports = StatsRepository;