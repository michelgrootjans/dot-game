const Stats = (gameId, startTime) => {
  let wip = 0;
  const history = [{time: 0, wip}]

  const getTime = time => (time - startTime)/1000;

  return {
    gameId,
    history,
    addTask: (time, task) => {
      return history.push({time: getTime(time), wip: ++wip});
    },
    removeTask: (time, task) => history.push({time: getTime(time), wip: --wip}),
  };
};

const StatsProcessManager = () => {
  const initialize = (stats, subscribe, currentTime) => {
    const findStats = gameId => stats.find(s => s.gameId === gameId);

    subscribe('IterationStarted', ({gameId}) => {
      stats.push(Stats(gameId, currentTime()))
    })
    subscribe('TaskCreated', ({gameId}) => {
      const current = findStats(gameId);
      current && current.addTask(currentTime(), {});
    })
    subscribe('TaskFinished', ({gameId}) => {
      const current = findStats(gameId);
      current && current.removeTask(currentTime(), {});
    })
  };
  return {
    initialize
  }
}

module.exports = {StatsProcessManager};