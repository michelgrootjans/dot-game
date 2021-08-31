const TaskCreated = (gameId, taskId) => {
  return {type: 'TaskCreated', gameId, taskId}
}

module.exports = {
  TaskCreated
}