const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const InMemoryDatabase = require("../application/InMemoryDatabase");
const {CreateTask, MoveTask} = require("../application/api/commands/task");
const {TaskCreated, TaskMoved} = require("../application/api/events/task");
const {IterationFinished} = require("../application/api/events/iteration");

describe('Tasks', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    const database = InMemoryDatabase();
    application = Application(database, () => {});
    application.execute(CreateGame({gameId: 'g1'}))
    application.execute(StartIteration({gameId: 'g1'}))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('creates a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated('g1', 't1', 'c1')
    ]);
  });

  it('moves a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated('g1', 't1', 'c1'),
      TaskMoved('g1', 't1', 'c2')
    ]);
  });

  it('moves a task twice', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated('g1', 't1', 'c1'),
      TaskMoved('g1', 't1', 'c2'),
      TaskMoved('g1', 't1', 'c3')
    ]);
  });

  it('cannot create a task when iteration is finished', () => {
    application.execute(EndIteration({gameId: 'g1'}))
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      IterationFinished('g1')
    ]);
  });

  it('cannot move a task when iteration is finished', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(EndIteration({gameId: 'g1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated('g1', 't1', 'c1'),
      IterationFinished('g1')
    ]);
  });

});

