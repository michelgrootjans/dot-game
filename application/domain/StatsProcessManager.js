const StatsProcessManager = () => {
  const initialize = (stats, subscribe) => {
    const findStats = gameId => stats.find(s => s.gameId === gameId);

    subscribe('IterationStarted', ({gameId}) => {
      stats.push({gameId, wip: 0})
    })
    subscribe('TaskCreated', ({gameId}) => {
      const current = findStats(gameId);
      current && (current.wip += 1);
    })
    subscribe('TaskFinished', ({gameId}) => {
      const current = stats.find(s => s.gameId === gameId);
      current && (current.wip -= 1)
    })
  };
  return {
    initialize
  }
}

module.exports = StatsProcessManager;