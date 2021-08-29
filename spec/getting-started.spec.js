const Application = (publish) => {
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
          throw `Unkown command: ${command}`;
      }
    }
  }
}
const StartIteration = (iterationId) => {return {type: 'StartIteration', iterationId}}
const EndIteration = (iterationId) => {return {type: 'EndIteration', iterationId: iterationId}}
const IterationStarted = (iterationId) => {return {type: 'IterationStarted', iterationId}}
const IterationFinished = (iterationId) => {return {type: 'IterationFinished', iterationId}}

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    events = [];
    application = Application(event => events.push(event));
  });

  it('can start', function () {
    application.execute(StartIteration('i1'))
    expect(events).toMatchObject([
      IterationStarted('i1')
    ]);
  });

  it('can end', function () {
    application.execute(StartIteration('i1'))
    application.execute(EndIteration('i1'))
    expect(events).toMatchObject([
      IterationStarted('i1'),
      IterationFinished('i1')
    ]);
  });

  it('cannot end an unstarted iteration', function () {
    application.execute(EndIteration('i1'))
    expect(events).toMatchObject([]);
  });
});
