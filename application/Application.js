const {CreateGameHandler} = require("./domain/gameHandlers");
const {StartIterationHandler, EndIterationHandler, IterationProcessManager} = require("./domain/iterationHandlers");
const {CreateTaskHandler, MoveTaskHandler, FindWorkHandler} = require("./domain/taskHandlers");
const {StatsProcessManager} = require("./domain/StatsProcessManager");

const intializeGames = ({games, delay, publish, subscribe}) => {
  const commandHandlers = {
    'CreateGame': CreateGameHandler(games, publish),

    'StartIteration': StartIterationHandler(games, publish),
    'EndIteration': EndIterationHandler(games, publish),

    'CreateTask': CreateTaskHandler(games, publish),
    'MoveTask': MoveTaskHandler(games, publish),

    'FindWork': FindWorkHandler(games)

  }

  const handlerFor = commandName => {
    if (commandHandlers.hasOwnProperty(commandName)) {
      return commandHandlers[commandName];
    }
    throw `Unknown command: ${JSON.stringify(commandName)}`;
  };

  const execute = command => {
    return handlerFor(command.type).execute(command);
  };

  IterationProcessManager().initialize(subscribe, execute, delay);

  // todo: remove this once this project is stable
  execute({type: 'CreateGame', gameId: 'dummy'})

  return {
    execute
  }
};

const initializeStats = ({stats, subscribe}) => {
  StatsProcessManager().initialize(stats, subscribe);
};

const Application = ({games, stats, delay, publish, subscribe}) => {
  const {execute} = intializeGames({games, delay, publish, subscribe});
  initializeStats({stats, subscribe})

  return {execute, subscribe, findGame: games.find, findStats: stats.find};
};

module.exports = Application