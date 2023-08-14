const TaskCreated = (options) => ({
  ...options,
  timestamp: Date.now(),
  type: 'TaskCreated',
})
const TaskMoved = (options) => ({
  ...options,
  timestamp: Date.now(),
  type: 'TaskMoved',
})
const TaskFinished = (options) => ({
  ...options,
  timestamp: Date.now(),
  type: 'TaskFinished',
})
const TaskRejected = (options) => ({
  ...options,
  timestamp: Date.now(),
  type: 'TaskRejected',
})

module.exports = { TaskCreated, TaskMoved, TaskFinished, TaskRejected }
