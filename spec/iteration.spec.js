const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const {IterationStarted, IterationFinished} = require("../application/api/events/iteration");
const GamesRepository = require("../application/GameRepository");
const EventBus = require("../application/EventBus");
const StatsRepository = require("../application/StatsRepository");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    const games = GamesRepository();
    const stats = StatsRepository();
    const {publish, subscribe} = EventBus();
    application = Application({games, stats, publish, subscribe, delay: () => {}});
    application.execute(CreateGame({gameId: 'g1'}))
    events = [];
    subscribe("*", event => events.push(event))
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
});

