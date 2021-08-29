const Application = (publish) => {
  return {
    execute: command => {
      switch (command.type) {
        case 'StartIteration':
          publish(IterationStarted());
          break;
        case 'EndIteration':
          publish(IterationFinished());
          break;
        default:
          throw `Unkown command: ${command}`;
      }
    }
  }
}
const StartIteration = () => {return {type: 'StartIteration'}}
const EndIteration = () => {return {type: 'EndIteration'}}
const IterationStarted = () => {return {type: 'IterationStarted'}}
const IterationFinished = () => {return {type: 'IterationFinished'}}

describe('a simple iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    events = [];
    application = Application(event => events.push(event));
  });

  it('start iteration', function () {
    application.execute(StartIteration())
    expect(events).toMatchObject([
      IterationStarted()
    ]);
  });
  it('end iteration', function () {
    application.execute(StartIteration())
    application.execute(EndIteration())
    expect(events).toMatchObject([
      IterationStarted(),
      IterationFinished()
    ]);
  });
});
