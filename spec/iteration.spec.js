const Application = require("../application/application");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const {IterationStarted, IterationFinished} = require("../application/api/events/iteration");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    events = [];
    application = Application({publish: event => events.push(event)});
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
