const EventBus = require("../application/EventBus");
const {EndIteration} = require("./api/commands/iteration");
const {IterationStarted, IterationFinished} = require("./api/events/iteration");
const InMemoryDatabase = require("./InMemoryDatabase");
const {CreateGame} = require("./domain/game");


function StartIteration(games, publish) {
  const execute = (command) => {
    const game = games.find(command.gameId);
    game.iterations.push(command.iterationId)
    publish(IterationStarted(game.gameId, command.iterationId));
  };
  return {
    execute: execute
  }
}

const endIteration = (games, publish) => {
  const execute = command => {
    const game = games.find(command.gameId)

    if (game && game.iterations.includes(command.iterationId))
      publish(IterationFinished(game.gameId, command.iterationId));
  }

  return {execute}
};

const Application = (games = InMemoryDatabase()) => {
  const {publish, subscribe} = EventBus();

  const handlers = {
    'CreateGame': CreateGame(games, publish),
    'StartIteration': StartIteration(games, publish),
    'EndIteration': endIteration(games, publish)
  }

  const execute = command => {
    if (handlers.hasOwnProperty(command.type))
      handlers[command.type].execute(command);
    else {
      console.log({handlers});
      throw `Unknown command: ${JSON.stringify(command)}`;
    }
  };

  subscribe('IterationStarted', event => setTimeout(() => execute(EndIteration(event.gameId, event.iterationId)), 5 * 1000))

  return {
    execute,
    publish,
    subscribe
  }
};

module.exports = Application