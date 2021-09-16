const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const {IterationStarted, IterationFinished} = require("../application/api/events/iteration");
const TestApplication = require("./TestApplication");
const TestDate = require("./TestDate");

describe('Iteration', () => {
  beforeEach(TestDate.freeze);
  afterEach(TestDate.unfreeze);

  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('cannot start a games again', function () {
    application.execute(CreateGame({gameId: 'g1'}))
    expect(events).toMatchObject([]);
  });

  it('can start', function () {
    application.execute(StartIteration({gameId: 'g1', duration: 1000}))
    expect(events).toMatchObject([
      IterationStarted({gameId: 'g1', duration: 1000})
    ]);
  });

  it('cannot run two iterations in parallel', function () {
    application.execute(StartIteration({gameId: 'g1'}))
    application.execute(StartIteration({gameId: 'g1'}))
    expect(events).toMatchObject([
      IterationStarted({gameId: 'g1'})
    ]);
  });

  it('can start with default duration', function () {
    application.execute(StartIteration({gameId: 'g1'}))
    expect(events).toMatchObject([
      IterationStarted({gameId: 'g1'})
    ]);
  });

  it('can end', function () {
    application.execute(StartIteration({gameId: 'g1'}))
    application.execute(EndIteration({gameId: 'g1'}))
    expect(events).toMatchObject([
      IterationStarted({gameId: 'g1'}),
      IterationFinished({gameId: 'g1'})
    ]);
  });

  it('an ended iteration cannot be ended again', function () {
    application.execute(StartIteration({gameId: 'g1'}))
    application.execute(EndIteration({gameId: 'g1'}))
    application.execute(EndIteration({gameId: 'g1'}))
    expect(events).toMatchObject([
      IterationStarted({gameId: 'g1'}),
      IterationFinished({gameId: 'g1'})
    ]);
  });
});
