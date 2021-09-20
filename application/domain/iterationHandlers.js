const {EndIteration} = require("../api/commands/iteration");

const StartIterationHandler = (games, publish) => {
  const execute = ({gameId, iterationId, duration}) => games.find(gameId)?.startIteration(iterationId, duration, publish);
  return {execute}
};

const EndIterationHandler = (games, publish) => {
  const execute = ({gameId}) => games.find(gameId)?.endIteration(publish)
  return {execute}
};

const IterationProcessManager = () => {
  const initialize = (subscribe, execute, delay) => {
    subscribe('IterationStarted', event => delay(() => execute(EndIteration(event)), event.duration));
  };

  return {initialize};
};

module.exports = {StartIterationHandler, EndIterationHandler, IterationProcessManager}