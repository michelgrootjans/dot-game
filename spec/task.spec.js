const {CreateGame} = require("../application/api/commands/game");
const {StartIteration, EndIteration} = require("../application/api/commands/iteration");
const {CreateTask, MoveTask, RejectTask} = require("../application/api/commands/task");
const {TaskCreated, TaskMoved, TaskFinished, TaskRejected} = require("../application/api/events/task");
const {IterationFinished} = require("../application/api/events/iteration");
const TestApplication = require("./TestApplication");
const TestDate = require("./TestDate");

describe('Tasks', () => {
  beforeEach(TestDate.freeze);
  afterEach(TestDate.unfreeze);

  let application = undefined;
  let events = undefined;

  beforeEach(() => {
    application = TestApplication();
    application.execute(CreateGame({gameId: 'g1'}))
    application.execute(StartIteration({gameId: 'g1'}))
    events = [];
    application.subscribe("*", event => events.push(event))
  });

  it('creates a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1'}})
    ]);
  });

  it('moves a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1'}, to: {columnId: 'c2'}})
    ]);
  });

  it('rejects a task', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(RejectTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1'}, to: {columnId: 'c10'}}),
      TaskRejected({gameId: 'g1', taskId: 't1', column: {columnId: 'c10'}}),
    ]);
  });

  it('moves a task twice', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1'}, to: {columnId: 'c2'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c2'}, to: {columnId: 'c3'}})
    ]);
  });

  it('moves a task until done', () => {
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}));
    for (let i = 1; i < 9; i++) {
      application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))
    }
    expect(events).toMatchObject([
      TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c1'}, to: {columnId: 'c2'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c2'}, to: {columnId: 'c3'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c3'}, to: {columnId: 'c4'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c4'}, to: {columnId: 'c5'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c5'}, to: {columnId: 'c6'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c6'}, to: {columnId: 'c7'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c7'}, to: {columnId: 'c8'}}),
      TaskMoved({gameId: 'g1', taskId: 't1', from: {columnId: 'c8'}, to: {columnId: 'c9'}}),
      TaskFinished({gameId: 'g1', taskId: 't1'}),
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
      TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1'}}),
      IterationFinished({gameId: 'g1'})
    ]);
  });

});

