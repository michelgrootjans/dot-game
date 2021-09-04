const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const GamesRepository = require("../application/GameRepository");
const initialState = require("../application/domain/initial-state");
const EventBus = require("../application/EventBus");
const StatsRepository = require("../application/StatsRepository");

const TestApplication = () => {
  const games = GamesRepository();
  const stats = StatsRepository();
  const {publish, subscribe} = EventBus();
  const delay = () => {};
  const application = Application({games, stats, publish, subscribe, delay});
  return {
    ...application
  };
};

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('cannot start a games again', function () {
    expect(application.findGame('g1')).toMatchObject(initialState())
  });

});

