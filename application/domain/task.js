const {TaskCreated} = require("../api/events/task");

const CreateTaskHandler = (games, publish) => {
  const execute = ({gameId, taskId}) => {
    publish(TaskCreated(gameId, taskId))
  };
  return {execute}
};

module.exports = {CreateTaskHandler};