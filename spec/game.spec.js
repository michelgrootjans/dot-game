const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const InMemoryDatabase = require("../application/GameRepository");
const initialState = require("../application/domain/initial-state");
const EventBus = require("../application/EventBus");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    const games = InMemoryDatabase();
    const {publish, subscribe} = EventBus();
    application = Application({games, publish, subscribe, delay: () => {}});
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('cannot start a games again', function () {
    expect(application.findGame('g1')).toMatchObject(initialState())
  });

});

