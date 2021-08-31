const {IterationStarted, IterationFinished} = require("../api/events/iteration");
const {EndIteration} = require("../api/commands/iteration");

const StartIterationHandler = (games, publish) => {
  const execute = ({gameId, duration}) => {
    const game = games.find(gameId);
    if (game) {
      game.startIteration(duration);
      publish(IterationStarted(game.gameId, duration));
    }
  };
  return {execute}
};

const EndIterationHandler = (games, publish) => {
  const execute = ({gameId}) => {
    const game = games.find(gameId)

    if (game) {
      game.endIteration()
      publish(IterationFinished(game.gameId));
    }
  }

  return {execute}
};

const IterationProcessManager = () => {
  const initialize = (subscribe, execute, delay) => {
    subscribe('IterationStarted', event => delay(() => execute(EndIteration(event)), event.duration));
  };

  return {initialize};
};

module.exports = {StartIterationHandler, EndIterationHandler, IterationProcessManager}