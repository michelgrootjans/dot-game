const TaskCreated = ({gameId, taskId, columnId}) => ({type: 'TaskCreated', gameId, taskId, columnId})
const TaskMoved = ({gameId, taskId, columnId}) => ({type: 'TaskMoved', gameId, taskId, to: columnId})
const TaskFinished = ({gameId, taskId}) => ({type: 'TaskFinished', gameId, taskId})

module.exports = {TaskCreated, TaskMoved, TaskFinished}