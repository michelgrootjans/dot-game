const {CreateGame} = require("../application/api/commands/game");
const initialState = require("../application/domain/initial-state");
const TestApplication = require("./TestApplication");

describe('Game', () => {
  let application = undefined;

  beforeEach(() => {
    application = TestApplication();
  });

  it('can only start once', function () {
    application.execute(CreateGame({gameId: 'g1'}))
    expect(application.findGame('g1')).toMatchObject(initialState())
  });

});

