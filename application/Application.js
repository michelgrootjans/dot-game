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

  // todo: remove this once this project is stable
  execute({type: 'CreateGame', gameId: 'default'})

  return {
    execute
  }
};

const initializeStats = ({stats, subscribe, currentTime}) => {
  StatsProcessManager().initialize(stats, subscribe, currentTime);
};

const Application = ({games, stats, delay, publish, subscribe, currentTime = () => Date.now()}) => {
  const {execute} = intializeGames({games, delay, publish, subscribe});
  initializeStats({stats, subscribe, currentTime})

  return {execute, subscribe, findGame: games.find, findStats: stats.find};
};

module.exports = Application