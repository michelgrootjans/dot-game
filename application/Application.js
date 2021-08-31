const EventBus = require("../application/EventBus");
const {CreateGameHandler} = require("./domain/game");
const {StartIterationHandler, EndIterationHandler, IterationProcessManager} = require("./domain/iteration");
const {CreateTaskHandler} = require("./domain/task");

const Application = (games, delay) => {
  const {publish, subscribe} = EventBus();

  const commandHandlers = {
    'CreateGame': CreateGameHandler(games, publish),

    'StartIteration': StartIterationHandler(games, publish),
    'EndIteration': EndIterationHandler(games, publish),

    'CreateTask': CreateTaskHandler(games, publish)
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