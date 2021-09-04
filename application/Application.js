const EventBus = require("../application/EventBus");
const {CreateGameHandler} = require("./domain/gameHandlers");
const {StartIterationHandler, EndIterationHandler, IterationProcessManager} = require("./domain/iterationHandlers");
const {CreateTaskHandler, MoveTaskHandler} = require("./domain/taskHandlers");
const StatsProcessManager = require("./domain/StatsProcessManager");

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

const initializeStats = ({stats, subscribe}) => {
  StatsProcessManager().initialize(stats, subscribe);
};

const Application = ({games, stats = [], delay, publish, subscribe}) => {
  const {execute} = intializeGames({games, delay, publish, subscribe});
  initializeStats({stats, subscribe})

  return {execute, subscribe, findGame: games.find};
};

module.exports = Application