const Stats = (gameId, startTime) => {
  let currentStats = {wip: 0, done: 0}
  const history = [{time: 0, ...currentStats}]

  const getTime = time => (time - startTime)/1000;

  return {
    gameId,
    history,
    addTask: (time) => {
      currentStats.wip++;
      return history.push({time: getTime(time), ...currentStats});
    },
    removeTask: (time) => {
      currentStats.wip--;
      currentStats.done++;
      return history.push({time: getTime(time), ...currentStats});
    },
  };
};

const StatsProcessManager = () => {
  const initialize = (stats, subscribe, currentTime) => {
    subscribe('IterationStarted', ({gameId}) => {
      stats.push(Stats(gameId, currentTime()))
    })
    subscribe('TaskCreated', ({gameId}) => {
      const current = stats.findStats(gameId);
      current && current.addTask(currentTime());
    })
    subscribe('TaskFinished', ({gameId}) => {
      const current = stats.findStats(gameId);
      current && current.removeTask(currentTime());
    })
  };
  return {
    initialize
  }
}

module.exports = {StatsProcessManager};