const { v4: uuid } = require('uuid')

const CreateTaskHandler = (games, publish) => {
  const execute = ({ gameId, taskId = uuid() }) => games.find(gameId)?.createTask(taskId, publish)
  return { execute }
}

const MoveTaskHandler = (games, publish) => {
  const execute = (command) => games.find(command.gameId)?.moveTask(command, publish)
  return { execute }
}

const RejectTaskHandler = (games, publish) => {
  const execute = (command) => games.find(command.gameId)?.rejectTask(command, publish)
  return { execute }
}

const FindWorkHandler = (games) => {
  const execute = ({ gameId, columnId }) => games.find(gameId)?.findWork(columnId)
  return { execute }
}

module.exports = {
  CreateTaskHandler,
  MoveTaskHandler,
  RejectTaskHandler,
  FindWorkHandler,
}
