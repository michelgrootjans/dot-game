const StatsProcessManager = () => {
  const initialize = (stats, subscribe) => {
    subscribe('IterationStarted', ({gameId}) => {
      stats.push({gameId})
    })
    subscribe('TaskCreated', () => {
      
    })
  };
  return {
    initialize
  }
}

module.exports = StatsProcessManager;