const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {EndIteration} = require("../api/commands/iteration");

const StartIteration = (games, publish) => {
  const execute = ({gameId, iterationId, duration}) => {
    const game = games.find(gameId);
    if (game) {
      game.iterations.push(iterationId);
      publish(IterationStarted(game.gameId, iterationId, duration));
    }
  };
  return {execute}
};

const EndIterationHandler = (games, publish) => {
  const execute = ({gameId, iterationId}) => {
    const game = games.find(gameId)

    if (game) {
      publish(IterationFinished(game.gameId, iterationId));
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