const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const {TaskCreated, TaskFinished} = require("../application/api/events/task");
const TestApplication = require("./TestApplication");

describe('stats end-to-end', () => {

  it("keeps history", () => {
    application = TestApplication();

    application.execute(CreateGame({gameId: 'g1'}));
    application.execute(StartIteration({gameId: 'g1', duration: 0}));

    application.advanceTime(1);
    application.publish(TaskCreated({gameId: 'g1', taskId: 't1', columnId: 'c1'}))

    application.advanceTime(1);
    application.publish(TaskFinished({gameId: 'g1', taskId: 't1'}))

    expect(application.findStats('g1')).toMatchObject({
      history: [{time: 0, wip: 0}, {time: 1, wip: 1}, {time: 2, wip: 0}],
    })
  });
});

// when command
// then stats with timing