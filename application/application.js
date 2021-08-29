const {IterationStarted, IterationFinished} = require("./api/events/iteration");
const {EndIteration} = require("./api/commands/iteration");
const {application} = require("express");

let counter = 0;

const Application = ({publish, subscribe}) => {
  const iterations = []
  const name = "application" + counter++
  console.log(`creating ${name}`)


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
    name
  }
};

module.exports = Application