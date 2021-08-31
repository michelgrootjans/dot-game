const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const InMemoryDatabase = require("../application/InMemoryDatabase");
const {CreateTask} = require("../application/api/commands/task");
const {TaskCreated, TaskMoved} = require("../application/api/events/task");

describe('Tasks', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    const database = InMemoryDatabase();
    application = Application(database, () => {});
    application.execute(CreateGame('g1'))
    application.execute(StartIteration('g1', 'i1'))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('creates a workitem', () => {
    application.execute(CreateTask('g1', 't1'))
    expect(events).toMatchObject([
      TaskCreated('g1', 't1', 'c1')
    ]);
  });

});

