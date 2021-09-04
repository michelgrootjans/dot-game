const EventBus = require("../application/EventBus");
const {CreateGameHandler} = require("./domain/gameHandlers");
const {StartIterationHandler, EndIterationHandler, IterationProcessManager} = require("./domain/iterationHandlers");
const {CreateTaskHandler, MoveTaskHandler} = require("./domain/taskHandlers");

const intializeGames = ({games, delay, publish, subscribe}) => {
  const commandHandlers = {
    'CreateGame': CreateGameHandler(games, publish),

    'StartIteration': StartIterationHandler(games, publish),
    'EndIteration': EndIterationHandler(games, publish),

    'CreateTask': CreateTaskHandler(games, publish),
    'MoveTask': MoveTaskHandler(games, publish),
  }

  const handlerFor = commandName => {
    if (commandHandlers.hasOwnProperty(commandName)) {
      return commandHandlers[commandName];
    }
    throw `Unknown command: ${JSON.stringify(commandName)}`;
  };

  const execute = command => handlerFor(command.type).execute(command);

  IterationProcessManager().initialize(subscribe, execute, delay);

  execute({type: 'CreateGame', gameId: 'default'})

  return {
    execute
  }
};

const initializeStats = ({games, subscribe}) => {
};

const Application = (games, delay) => {
  const {publish, subscribe} = EventBus();
  const {execute} = intializeGames({games, delay, publish, subscribe});
  initializeStats({games, subscribe})

  return {execute, subscribe, findGame: games.find};
};

module.exports = Application