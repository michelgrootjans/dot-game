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
    const handlerFor1 = handlerFor(command.type);
    return handlerFor1.execute(command);
  };

  IterationProcessManager().initialize(subscribe, execute, delay);

  execute({type: 'CreateGame', gameId: 'default'})

  findColumn = () => ({

  }
)
  return {
    execute,
    findColumn,
  }
};

const initializeStats = ({stats, subscribe, currentTime}) => {
  StatsProcessManager().initialize(stats, subscribe, currentTime);
};

const Application = ({games, stats, delay, publish, subscribe, currentTime = () => Date.now()}) => {
  const {execute, findColumn} = intializeGames({games, delay, publish, subscribe});
  initializeStats({stats, subscribe, currentTime})

  return {execute, subscribe, findGame: games.find, findColumn, findStats: stats.find};
};

module.exports = Application