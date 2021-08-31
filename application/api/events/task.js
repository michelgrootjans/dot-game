const TaskCreated = ({gameId, taskId, columnId}) => {
  return {type: 'TaskCreated', gameId, taskId, columnId}
}

const TaskMoved = ({gameId, taskId, columnId}) => {
  return {type: 'TaskMoved', gameId, taskId, to: columnId}
}

const TaskFinished = () => {
  return {type: 'TaskFinished'}
}

module.exports = {TaskCreated, TaskMoved, TaskFinished}