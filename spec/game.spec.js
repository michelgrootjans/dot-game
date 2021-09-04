const {CreateGame} = require("../application/api/commands/game");
const initialState = require("../application/domain/initial-state");
const TestApplication = require("./TestApplication");

describe('Iteration', () => {
  let application = undefined;

  beforeEach(() => {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('cannot start a games again', function () {
    expect(application.findGame('g1')).toMatchObject(initialState())
  });

});

