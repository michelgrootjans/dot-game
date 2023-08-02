const { CreateGameHandler } = require('./domain/gameHandlers')
const { StartIterationHandler, EndIterationHandler, IterationProcessManager } = require('./domain/iterationHandlers')
const { CreateTaskHandler, MoveTaskHandler, FindWorkHandler, RejectTaskHandler } = require('./domain/taskHandlers')
const { StatsProcessManager } = require('./domain/StatsProcessManager')
const { JoinGameHandler, LeaveGameHandler } = require('./domain/PlayerHandlers')

const intializeGames = ({ games, delay, publish, subscribe, events }) => {
  subscribe('*', events.store)

  const commandHandlers = {
    CreateGame: CreateGameHandler(games, publish),

    StartIteration: StartIterationHandler(games, publish),
    EndIteration: EndIterationHandler(games, publish),

    JoinGame: JoinGameHandler(games, publish),
    LeaveGame: LeaveGameHandler(games, publish),

    CreateTask: CreateTaskHandler(games, publish),
    MoveTask: MoveTaskHandler(games, publish),
    RejectTask: RejectTaskHandler(games, publish),

    FindWork: FindWorkHandler(games),
  }

  const handlerFor = (commandName) => {
    if (commandHandlers.hasOwnProperty(commandName)) {
      return commandHandlers[commandName]
    }
    throw `Unknown command: ${JSON.stringify(commandName)}`
  }

  const execute = (command) => handlerFor(command.type).execute(command)

  IterationProcessManager().initialize(subscribe, execute, delay)

  // todo: remove this once this project is stable
  execute({ type: 'CreateGame', gameId: 'dummy' })

  return {
    execute,
  }
}

const initializeStats = ({ stats, subscribe }) => {
  StatsProcessManager().initialize(stats, subscribe)
}

const Application = ({ games, stats, delay, publish, subscribe, events }) => {
  const { execute } = intializeGames({ games, delay, publish, subscribe, events })
  initializeStats({ stats, subscribe })

  return { execute, subscribe, findGame: games.find, findStats: stats.find }
}

module.exports = Application
