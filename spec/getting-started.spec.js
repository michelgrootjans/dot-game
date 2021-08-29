const Application = (publish) => {
  return {
    execute: () => {publish(IterationStarted())}
  }
}
const StartIteration = () => {}
const IterationStarted = () => {}

describe('a simple iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    events = [];
    application = Application(event => events.push(event));
  });

  it('should work', function () {
    application.execute(StartIteration())
    expect(events).toMatchObject([
      IterationStarted()
    ]);
  });
});
