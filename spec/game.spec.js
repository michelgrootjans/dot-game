const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const GamesRepository = require("../application/GameRepository");
const initialState = require("../application/domain/initial-state");
const EventBus = require("../application/EventBus");
const StatsRepository = require("../application/StatsRepository");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    const games = GamesRepository();
    const stats = StatsRepository();
    const {publish, subscribe} = EventBus();
    application = Application({games, stats, publish, subscribe, delay: () => {}});
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('cannot start a games again', function () {
    expect(application.findGame('g1')).toMatchObject(initialState())
  });

});

