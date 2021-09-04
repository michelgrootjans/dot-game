const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const InMemoryDatabase = require("../application/InMemoryDatabase");
const initialState = require("../application/domain/initial-state");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    const database = InMemoryDatabase();
    application = Application(database, () => {});
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('cannot start a games again', function () {
    expect(application.findGame('g1')).toMatchObject(initialState())
  });

});

