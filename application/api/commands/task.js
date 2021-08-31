const CreateTask = (gameId, taskId) => {
  return {type: 'CreateTask', gameId, taskId}
};

module.exports = CreateTask;