const {CreateGame} = require("../application/api/commands/game");
const TestApplication = require("./TestApplication");

describe('Iteration', () => {
  let application = undefined;

  beforeEach(function () {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('should work', function () {
    expect(application.execute({type: 'FindWork', gameId: 'g1', columnId: 'c2'})).toMatchObject({
      inbox: {columnId: "c1"},
      work: {columnId: "c2"},
      outbox: {columnId: "c3"}
    });
  });

});

