const {CreateGame} = require("../application/api/commands/game");
const TestApplication = require("./TestApplication");
const {FindWork} = require("../application/api/commands/iteration");

describe('Iteration', () => {
  let application = undefined;

  beforeEach(function () {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('get the first work column', function () {

    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c2'}))).toMatchObject({
      gameId: 'g1',
      inbox: {columnId: 'c1'},
      work: {columnId: 'c2'},
      outbox: {columnId: 'c3'}
    });
  });

  it('get the second work column', function () {
    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c4'}))).toMatchObject({
      gameId: 'g1',
      inbox: {columnId: 'c3', columnType: 'queue-column'},
      work: {columnId: 'c4', columnType: 'work-column'},
      outbox: {columnId: 'c5', columnType: 'queue-column'}
    });
  });

});

