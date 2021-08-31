const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const InMemoryDatabase = require("../application/InMemoryDatabase");
const CreateWorkItem = require("../application/api/commands/workItem");

describe('Iteration', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(function () {
    const database = InMemoryDatabase();
    application = Application(database, () => {});
    application.execute(CreateGame('g1'))
    application.execute(StartIteration('g1', 'i1'))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('creates a workitem', function () {
    application.execute(CreateWorkItem('g1', 'w1'))
    // expect(events).toMatchObject([
    //   WorkItemCreated('g1', 'w1')
    // ]);

  });

});

