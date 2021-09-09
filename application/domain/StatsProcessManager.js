const IterationStats = (iterationStartedEvent, startTime) => {
  const getTime = time => (time - startTime) / 1000;
  const tasks = iterationStartedEvent.columns.map(column => column.taskName)

  let currentStats = tasks.reduce((stats, task) => {
    stats[task] = 0
    return stats;
  } , {})
  let history = [{time: 0, ...currentStats} ]

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

const GameStats = (iterationStartedEvent, startTime) => {
  let currentIteration = IterationStats(iterationStartedEvent, startTime);

  const restart = time => currentIteration = IterationStats(iterationStartedEvent, time)

  return {
    gameId: iterationStartedEvent.gameId,
    history: () => currentIteration.history(),
    addTask: (time, event) => currentIteration.addTask(time, event),
    moveTask: (time, event) => currentIteration.moveTask(time, event),
    restart
  };
};

const StatsProcessManager = () => {
  const initialize = (stats, subscribe, currentTime) => {
    subscribe('IterationStarted', (event) => {
      const current = stats.find(event.gameId);
      if (current) {
        current.restart(currentTime())
      } else {
        stats.add(GameStats(event, currentTime()));
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