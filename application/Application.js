const {IterationStarted, IterationFinished} = require("./api/events/iteration");
const {EndIteration} = require("./api/commands/iteration");
const EventBus = require("../application/EventBus");

let counter = 0;

const Application = () => {
  const eventBus = EventBus();
  const subscribe = eventBus.subscribe
  const publish = eventBus.publish
  const tap = eventBus.tap

  const iterations = []
  const name = "application" + counter++

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

  subscribe('IterationStarted', event => setTimeout(() => execute(EndIteration(event.iterationId)), 1000))

  return {
    execute,
    tap,
    name
  }
};

module.exports = Application