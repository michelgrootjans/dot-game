const Stats = (gameId, startTime) => {
  let currentStats = {wip: 0, done: 0}
  let history = [{time: 0, ...currentStats}]

  const getTime = time => (time - startTime)/1000;

  const restart = time => {
    currentStats = {wip: 0, done: 0};
    history = [{time: 0, ...currentStats}]
  }

  return {
    gameId,
    history: () => history,
    addTask: (time) => {
      currentStats.wip++;
      return history.push({time: getTime(time), ...currentStats});
    },
    removeTask: (time) => {
      currentStats.wip--;
      currentStats.done++;
      return history.push({time: getTime(time), ...currentStats});
    },
    restart
  };
};

const StatsProcessManager = () => {
  const initialize = (stats, subscribe, currentTime) => {
    subscribe('IterationStarted', ({gameId}) => {
      const current = stats.find(gameId);
      if (current) {
        current.restart(currentTime())
      } else {
        stats.add(Stats(gameId, currentTime()));
      }
    })
    subscribe('TaskCreated', ({gameId}) => {
      const current = stats.find(gameId);
      current && current.addTask(currentTime());
    })
    subscribe('TaskFinished', ({gameId}) => {
      const current = stats.find(gameId);
      current && current.removeTask(currentTime());
    })
  };
  return {
    initialize
  }
}

module.exports = {StatsProcessManager};