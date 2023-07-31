const IterationStats = (iterationStartedEvent, startTime) => {
  const getTime = (time) => (time - startTime) / 1000
  const tasks = iterationStartedEvent.columns.map((column) => column.taskName)
  const lastTaskName = tasks[tasks.length - 1]

  let currentStats = tasks.reduce((stats, task) => ({ ...stats, [task]: 0 }), {
    time: 0,
    wip: 0,
  })
  let history = [{ ...currentStats }]

  const increment = (taskName) => {
    if (!currentStats[taskName]) currentStats[taskName] = 1
    else currentStats[taskName]++
  }

  const decrement = (taskName) => {
    if (!currentStats[taskName]) currentStats[taskName] = 0
    else currentStats[taskName]--
  }

  return {
    addTask: (time, event) => {
      increment(event.column.taskName)
      increment('wip')
      return history.push({ ...currentStats, time: getTime(time) })
    },
    moveTask: (time, event) => {
      decrement(event.from.taskName)
      increment(event.to.taskName)
      if (event.to.taskName === lastTaskName) decrement('wip')
      return history.push({ ...currentStats, time: getTime(time) })
    },
    history: () => history,
  }
}

const GameStats = (iterationStartedEvent, startTime) => {
  let currentIteration = IterationStats(iterationStartedEvent, startTime)

  const restart = (time) =>
    (currentIteration = IterationStats(iterationStartedEvent, time))

  return {
    gameId: iterationStartedEvent.gameId,
    iterationId: iterationStartedEvent.iterationId,
    history: () => currentIteration.history(),
    addTask: (time, event) => currentIteration.addTask(time, event),
    moveTask: (time, event) => currentIteration.moveTask(time, event),
    restart,
  }
}

const StatsProcessManager = () => {
  const initialize = (stats, subscribe) => {
    subscribe('IterationStarted', (event) => {
      const current = stats.find(event.gameId, event.iterationId)
      if (current) {
        current.restart(Date.now())
      } else {
        stats.add(GameStats(event, Date.now()))
      }
    })
    subscribe('TaskCreated', (event) => {
      const current = stats.find(event.gameId, event.iterationId)
      current && current.addTask(Date.now(), event)
    })
    subscribe('TaskMoved', (event) => {
      const current = stats.find(event.gameId, event.iterationId)
      current && current.moveTask(Date.now(), event)
    })
  }
  return {
    initialize,
  }
}

module.exports = { StatsProcessManager }
