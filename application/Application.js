const EventBus = require("../application/EventBus");
const {CreateGameHandler} = require("./domain/gameHandlers");
const {StartIterationHandler, EndIterationHandler, IterationProcessManager} = require("./domain/iterationHandlers");
const {CreateTaskHandler, MoveTaskHandler} = require("./domain/taskHandlers");

const Application = (games, delay) => {
  const {publish, subscribe} = EventBus();

  const commandHandlers = {
    'CreateGame': CreateGameHandler(games, publish),

    'StartIteration': StartIterationHandler(games, publish),
    'EndIteration': EndIterationHandler(games, publish),

    'CreateTask': CreateTaskHandler(games, publish),
    'MoveTask': MoveTaskHandler(games, publish),
  }

  const execute = command => {
    if (commandHandlers.hasOwnProperty(command.type)) {
      commandHandlers[command.type].execute(command);
    } else {
      throw `Unknown command: ${JSON.stringify(command)}`;
    }
  };

  IterationProcessManager().initialize(subscribe, execute, delay);

  return {
    execute,
    subscribe
  }
};

module.exports = Application