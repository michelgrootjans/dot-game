const IterationStats = (startTime) => {
  let currentStats = {}
  let history = []

  const getTime = time => (time - startTime) / 1000;

  const increment = taskName => {
    if (!currentStats[taskName]) currentStats[taskName] = 1
    else currentStats[taskName]++;
  };

  function decrement(taskName) {
    if (!currentStats[taskName]) currentStats[taskName] = 0
    else currentStats[taskName]--;
  }

  return {
    addTask: (time, event) => {
      increment(event.column.taskName);
      return history.push({time: getTime(time), ...currentStats});
    },
    moveTask: (time, event) => {
      decrement(event.from.taskName);
      increment(event.to.taskName)

      return history.push({time: getTime(time), ...currentStats});
    },
    history: () => history
  }
};

const GameStats = (gameId, startTime) => {
  let currentIteration = IterationStats(startTime);

  const restart = time => currentIteration = IterationStats(time)

  return {
    gameId,
    history: () => currentIteration.history(),
    addTask: (time, event) => currentIteration.addTask(time, event),
    moveTask: (time, event) => currentIteration.moveTask(time, event),
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
        stats.add(GameStats(gameId, currentTime()));
      }
    })
    subscribe('TaskCreated', (event) => {
      const current = stats.find(event.gameId);
      current && current.addTask(currentTime(), event);
    })
    subscribe('TaskMoved', (event) => {
      const current = stats.find(event.gameId);
      current && current.moveTask(currentTime(), event);
    })
  };
  return {
    initialize
  }
}

module.exports = {StatsProcessManager};