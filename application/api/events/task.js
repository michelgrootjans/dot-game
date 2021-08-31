const TaskCreated = ({gameId, taskId, columnId}) => {
  return {type: 'TaskCreated', gameId, taskId, columnId}
}

const TaskMoved = ({gameId, taskId, columnId}) => {
  return {type: 'TaskMoved', gameId, taskId, to: columnId}
}

const TaskFinished = ({gameId, taskId}) => {
  return {type: 'TaskFinished', gameId, taskId}
}

module.exports = {TaskCreated, TaskMoved, TaskFinished}