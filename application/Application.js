const EventBus = require("../application/EventBus");
const {CreateGame} = require("./domain/game");
const {StartIteration, EndIterationHandler, IterationProcessManager} = require("./domain/iteration");
const {CreateWorkItemHandler} = require("./domain/workitem");

const Application = (games, delay) => {
  const {publish, subscribe} = EventBus();

  const commandHandlers = {
    'CreateGame': CreateGame(games, publish),

    'StartIteration': StartIteration(games, publish),
    'EndIteration': EndIterationHandler(games, publish),

    'CreateWorkItem': CreateWorkItemHandler(games, publish)
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