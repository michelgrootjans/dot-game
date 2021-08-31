const {TaskCreated, TaskMoved, TaskFinished} = require("../api/events/task");

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
    if (task) {
      publish(TaskMoved({...task, gameId}));
      if (task.columnId === 'c9') {
        publish(TaskFinished({...task, gameId}));
      }
    }
  };
  return {execute}
};

module.exports = {CreateTaskHandler, MoveTaskHandler};