const {IterationStarted, IterationFinished} = require("./api/events/iteration");
const {EndIteration} = require("./api/commands/iteration");
const EventBus = require("../application/EventBus");

let counter = 0;

const Application = () => {
  const {publish, subscribe} = EventBus();

  const iterations = []

  const execute = command => {
    switch (command.type) {
      case 'StartIteration':
        iterations.push(command.iterationId);
        publish(IterationStarted(command.iterationId));
        break;
      case 'EndIteration':
        if (iterations.includes(command.iterationId))
          publish(IterationFinished(command.iterationId));
        break;
      default:
        throw `Unknown command: ${command}`;
    }
  };

  subscribe('IterationStarted', event => setTimeout(() => execute(EndIteration(event.iterationId)), 5 * 1000))

  return {
    execute,
    subscribe
  }
};

module.exports = Application