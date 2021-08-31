const CreateTask = ({gameId, taskId}) => {
  return {type: 'CreateTask', gameId, taskId}
};

const MoveTask = ({gameId, taskId}) => {
  return {type: 'MoveTask', gameId, taskId}
};

module.exports = {CreateTask, MoveTask};