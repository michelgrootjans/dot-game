const {CreateGame} = require("../application/api/commands/game");
const TestApplication = require("./TestApplication");
const {FindWork} = require("../application/api/commands/iteration");

describe('Iteration', () => {
  let application = undefined;

  beforeEach(function () {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
  });

  it('get the inbox work column', function () {
    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c1'}))).toMatchObject({
      gameId: 'g1',
      inbox: undefined,
      work: {columnId: 'c1'},
      outbox: {columnId: 'c2'},
      defects: {columnId: 'c10'},
    });
  });

  it('get the first work column', function () {
    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c2'}))).toMatchObject({
      gameId: 'g1',
      inbox: {columnId: 'c1'},
      work: {columnId: 'c2'},
      outbox: {columnId: 'c3'},
      defects: {columnId: 'c10'},
    });
  });

  it('get the second work column', function () {
    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c4'}))).toMatchObject({
      gameId: 'g1',
      inbox: {columnId: 'c3', columnType: 'queue-column'},
      work: {columnId: 'c4', columnType: 'work-column'},
      outbox: {columnId: 'c5', columnType: 'queue-column'},
      defects: {columnId: 'c10', columnType: 'defect-column'},
    });
  });

  it('get the done column', function () {
    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c9'}))).toMatchObject({
      gameId: 'g1',
      inbox: {columnId: 'c8'},
      work: {columnId: 'c9'},
      outbox: undefined,
      defects: {columnId: 'c10'},
    });
  });

  it('get the defects column', function () {
    expect(application.execute(FindWork({gameId: 'g1', columnId: 'c10'}))).toMatchObject({
      gameId: 'g1',
      inbox: {columnId: 'c8'},
      work: {columnId: 'c10'},
      outbox: undefined,
      defects: {columnId: 'c10'},
    });
  });

});

