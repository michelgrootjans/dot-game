const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const {IterationStarted, IterationFinished} = require("../application/api/events/iteration");
const InMemoryDatabase = require("../application/InMemoryDatabase");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    const database = InMemoryDatabase();
    application = Application(database, () => {});
    application.execute(CreateGame({gameId: 'g1'}))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('can start', function () {
    application.execute(StartIteration({gameId: 'g1'}))
    expect(events).toMatchObject([
      IterationStarted('g1')
    ]);
  });

  it('can end', function () {
    application.execute(StartIteration({gameId: 'g1'}))
    application.execute(EndIteration({gameId: 'g1'}))
    expect(events).toMatchObject([
      IterationStarted('g1'),
      IterationFinished('g1')
    ]);
  });
});

