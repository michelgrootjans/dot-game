const EventBus = require("../application/EventBus");
const {EndIteration} = require("./api/commands/iteration");
const {IterationStarted, IterationFinished} = require("./api/events/iteration");
const {GameCreated} = require("./api/events/game");

const Application = () => {
  const {publish, subscribe} = EventBus();
  const state = []
  const iterations = []

  const execute = command => {
    switch (command.type) {
      case 'CreateGame':
        state.push({gameId: command.gameId, iterations: []})
        publish(GameCreated(command.gameId));
        break;
      case 'StartIteration':
        state.filter(game => game.gameId === command.gameId)
             .forEach(game => game.iterations.push(command.iterationId))
        publish(IterationStarted(command.gameId, command.iterationId));
        break;
      case 'EndIteration':
        const game = state.find(game => game.gameId === command.gameId)

        if (game && game.iterations.includes(command.iterationId))
          publish(IterationFinished(command.gameId, command.iterationId));
        break;
      default:
        throw `Unknown command: ${JSON.stringify(command)}`;
    }
  };

  subscribe('IterationStarted', event => setTimeout(() => execute(EndIteration(event.gameId, event.iterationId)), 5 * 1000))

  return {
    execute,
    subscribe
  }
};

module.exports = Application