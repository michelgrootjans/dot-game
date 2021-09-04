const Application = require("../application/Application");
const {CreateGame} = require("../application/api/commands/game");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const InMemoryDatabase = require("../application/GameRepository");
const {CreateTask, MoveTask} = require("../application/api/commands/task");
const {TaskCreated, TaskMoved, TaskFinished} = require("../application/api/events/task");
const {IterationFinished} = require("../application/api/events/iteration");
const EventBus = require("../application/EventBus");

describe('Tasks', () => {
  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    const games = InMemoryDatabase();
    const {publish, subscribe} = EventBus();
    application = Application({games, publish, subscribe, delay: () => {}});
    application.execute(CreateGame({gameId: 'g1'}))
    application.execute(StartIteration({gameId: 'g1'}))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('creates a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId:'t1', columnId: 'c1'})
    ]);
  });

  it('moves a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId:'t1', columnId: 'c1'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c2'})
    ]);
  });

  it('moves a task twice', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId:'t1', columnId: 'c1'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c2'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c3'})
    ]);
  });

  it('moves a task until done', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}));
    for (let i = 1; i < 9; i++) {
      application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    }
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId:'t1', columnId: 'c1'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c2'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c3'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c4'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c5'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c6'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c7'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c8'}),
      TaskMoved({gameId: 'g1', taskId:'t1', columnId: 'c9'}),
      TaskFinished({gameId: 'g1', taskId:'t1'}),
    ]);
  });

  it('cannot create a task when iteration is finished', () => {
    application.execute(EndIteration({gameId: 'g1'}))
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      IterationFinished({gameId: 'g1'})
    ]);
  });

  it('cannot move a task when iteration is finished', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(EndIteration({gameId: 'g1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId:'t1', columnId: 'c1'}),
      IterationFinished({gameId: 'g1'})
    ]);
  });

});

