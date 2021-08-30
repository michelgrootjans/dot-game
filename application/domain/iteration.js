const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {EndIteration} = require("../api/commands/iteration");

const StartIteration = (games, publish) => {
  const execute = command => {
    const game = games.find(command.gameId);
    game.iterations.push(command.iterationId)
    publish(IterationStarted(game.gameId, command.iterationId, command.duration));
  };
  return {execute}
};

const EndIterationHandler = (games, publish) => {
  const execute = command => {
    const game = games.find(command.gameId)

    if (game && game.iterations.includes(command.iterationId)) {
      publish(IterationFinished(game.gameId, command.iterationId));
    }
  }

  return {execute}
};

const IterationProcessManager = () => {
  const initialize = (subscribe, execute, delay) => {
    subscribe('IterationStarted', event => delay(() => execute(EndIteration(event.gameId, event.iterationId)), event.duration));
  };

  return {initialize};
};

module.exports = {StartIteration, EndIterationHandler, IterationProcessManager}