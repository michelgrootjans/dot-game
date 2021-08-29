const {IterationStarted, IterationFinished} = require("./api/events/iteration");

const Application = ({publish}) => {
  const iterations = []

  return {
    execute: command => {
      switch (command.type) {
        case 'StartIteration':
          iterations.push(command.iterationId)
          publish(IterationStarted(command.iterationId));
          break;
        case 'EndIteration':
          if(iterations.includes(command.iterationId))
            publish(IterationFinished(command.iterationId));
          break;
        default:
          throw `Unknown command: ${command}`;
      }
    }
  }
}

module.exports = Application