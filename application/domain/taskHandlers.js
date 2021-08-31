const {TaskCreated, TaskMoved} = require("../api/events/task");

const CreateTaskHandler = (games, publish) => {
  const execute = ({gameId, taskId}) => {
    const game = games.find(gameId);
    const task = game.createTask(taskId)
    if(task)
      publish(TaskCreated({...task, gameId}))
  };
  return {execute}
};

const MoveTaskHandler = (games, publish) => {
  const execute = ({gameId, taskId}) => {
    const game = games.find(gameId);
    const task = game.moveTask(taskId)
    if(task)
      publish(TaskMoved({...task, gameId}))
  };
  return {execute}
};

module.exports = {CreateTaskHandler, MoveTaskHandler};