const EventBus = require("../application/EventBus");
const InMemoryDatabase = require("./InMemoryDatabase");
const {CreateGame} = require("./domain/game");
const {StartIteration, EndIterationHandler, IterationProcessManager} = require("./domain/iteration");


const Application = (games = InMemoryDatabase()) => {
  const {publish, subscribe} = EventBus();

  const handlers = {
    'CreateGame': CreateGame(games, publish),
    'StartIteration': StartIteration(games, publish),
    'EndIteration': EndIterationHandler(games, publish)
  }

  const execute = command => {
    if (handlers.hasOwnProperty(command.type)) {
      handlers[command.type].execute(command);
    }
    else {
      throw `Unknown command: ${JSON.stringify(command)}`;
    }
  };

  IterationProcessManager().initialize(subscribe, execute);

  return {
    execute,
    subscribe
  }
};

module.exports = Application