const {TaskCreated, TaskMoved} = require("../api/events/task");

const CreateTaskHandler = (games, publish) => {
  const execute = ({gameId, taskId}) => {
    const game = games.find(gameId);
    publish(TaskCreated(gameId, taskId, 'c1'))
  };
  return {execute}
};

const MoveTaskHandler = (games, publish) => {
  const execute = ({gameId, taskId}) => {
    publish(TaskMoved(gameId, taskId, 'c1'))
  };
  return {execute}
};

module.exports = {CreateTaskHandler, MoveTaskHandler};