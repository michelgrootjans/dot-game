const {CreateGame} = require("../application/api/commands/game");
const {StartIteration} = require("../application/api/commands/iteration");
const {TaskCreated, TaskFinished, TaskMoved} = require("../application/api/events/task");
const TestApplication = require("./TestApplication");
const {StatsProcessManager} = require("../application/domain/StatsProcessManager");
const StatsRepository = require("../application/StatsRepository");
const EventBus = require("../application/EventBus");
const {IterationStarted} = require("../application/api/events/iteration");
const {CreateTask, MoveTask} = require("../application/api/commands/task");
const TestDate = require("./TestDate");

describe('stats end-to-end', () => {
  beforeEach(TestDate.freeze);
  afterEach(TestDate.unfreeze);

  it("keeps history", () => {
    application = TestApplication();

    application.execute(CreateGame({
      gameId: 'g1', state: {
        columns: [
          {columnId: "c1", columnType: "todo-column", taskName: "todo", nextColumnId: "c2"},
          {columnId: "c2", columnType: "work-column", taskName: "busy", nextColumnId: "c3"},
          {columnId: "c3", columnType: "done-column", taskName: "done"},
        ]
      }
    }));
    application.execute(StartIteration({gameId: 'g1'}));

    TestDate.advanceTime(1);
    application.execute(CreateTask({gameId: 'g1', taskId: 't1'}));

    TestDate.advanceTime(1);
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))

    TestDate.advanceTime(1);
    application.execute(MoveTask({gameId: 'g1', taskId: 't1'}))

    expect(application.findStats('g1').history()).toMatchObject([
        {time: 0, todo: 0, busy: 0, done: 0},
        {time: 1, todo: 1, busy: 0, done: 0},
        {time: 2, todo: 0, busy: 1, done: 0},
        {time: 3, todo: 0, busy: 0, done: 1},
        {time: 3, todo: 0, busy: 0, done: 1},
      ]
    )

    TestDate.advanceTime(1);
    expect(application.findStats('g1').history()).toMatchObject([
        {time: 0, todo: 0, busy: 0, done: 0},
        {time: 1, todo: 1, busy: 0, done: 0},
        {time: 2, todo: 0, busy: 1, done: 0},
        {time: 3, todo: 0, busy: 0, done: 1},
        {time: 4, todo: 0, busy: 0, done: 1},
      ]
    )

  });
});

describe('Stats Process Manager', () => {
  beforeEach(TestDate.freeze);
  afterEach(TestDate.unfreeze);

  let stats, publish;

  const lastStat = () => {
    const history = stats.find('g1').history();
    return history[history.length - 1];
  };

  beforeEach(() => {
    stats = StatsRepository();
    const eventBus = EventBus();
    publish = eventBus.publish;
    StatsProcessManager().initialize(stats, eventBus.subscribe);
  });

  it("starts with a clean history", () => {
    publish(IterationStarted({gameId: 'g1', columns: [{columnId: 'c1', taskName: 'todo'}]}))

    expect(stats.find('g1').history()).toMatchObject([
      {time: 0, todo: 0, wip: 0},
      {time: 0, todo: 0, wip: 0},
    ])
  });

  it("adds one item", () => {
    publish(IterationStarted({gameId: 'g1', columns: [{columnId: 'c1', taskName: 'todo'}]}));
    TestDate.advanceTime(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))

    expect(stats.find('g1').history()).toMatchObject([
        {time: 0, todo: 0, wip: 0},
        {time: 1, todo: 1, wip: 1},
        {time: 1, todo: 1, wip: 1},
      ],
    )
  });

  it("moves one item", () => {
    publish(IterationStarted({
        gameId: 'g1', columns: [
          {columnId: 'c1', taskName: 'todo'},
          {columnId: 'c2', taskName: 'done'}
        ]
      }
    ));
    TestDate.advanceTime(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    TestDate.advanceTime(1);
    publish(TaskMoved({
      gameId: 'g1',
      taskId: 't1',
      from: {columnId: 'c1', taskName: 'todo'},
      to: {columnId: 'c2', taskName: 'done'}
    }))

    expect(stats.find('g1').history()).toMatchObject([
      {time: 0, todo: 0, done: 0, wip: 0},
      {time: 1, todo: 1, done: 0, wip: 1},
      {time: 2, todo: 0, done: 1, wip: 0},
      {time: 2, todo: 0, done: 1, wip: 0},
      ],
    )
  });

  it("moves multiple items", () => {
    publish(IterationStarted({
        gameId: 'g1', columns: [
          {columnId: 'c1', taskName: 'todo'},
          {columnId: 'c2', taskName: 'dev'},
          {columnId: 'c2', taskName: 'done'},
        ]
      }
    ));
    expect(lastStat()).toMatchObject({time: 0, todo: 0, dev: 0, done: 0, wip: 0})

    TestDate.advanceTime(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    expect(lastStat()).toMatchObject({time: 1, todo: 1, dev: 0, done: 0, wip: 1})
    publish(TaskCreated({gameId: 'g1', taskId: 't2', column: {columnId: 'c1', taskName: 'todo'}}))
    expect(lastStat()).toMatchObject({time: 1, todo: 2, dev: 0, done: 0, wip: 2})
    publish(TaskCreated({gameId: 'g1', taskId: 't3', column: {columnId: 'c1', taskName: 'todo'}}))
    expect(lastStat()).toMatchObject({time: 1, todo: 3, dev: 0, done: 0, wip: 3})

    TestDate.advanceTime(1);
    publish(TaskMoved({
      gameId: 'g1',
      taskId: 't1',
      from: {columnId: 'c1', taskName: 'todo'},
      to: {columnId: 'c2', taskName: 'dev'}
    }))
    expect(lastStat()).toMatchObject({time: 2, todo: 2, dev: 1, done: 0, wip: 3})
    publish(TaskMoved({
      gameId: 'g1',
      taskId: 't2',
      from: {columnId: 'c1', taskName: 'todo'},
      to: {columnId: 'c2', taskName: 'dev'}
    }))
    expect(lastStat()).toMatchObject({time: 2, todo: 1, dev: 2, done: 0, wip: 3})

    TestDate.advanceTime(1);
    publish(TaskMoved({
      gameId: 'g1',
      taskId: 't1',
      from: {columnId: 'c2', taskName: 'dev'},
      to: {columnId: 'c3', taskName: 'done'}
    }))
    expect(lastStat()).toMatchObject({time: 3, todo: 1, dev: 1, done: 1, wip: 2})
  });

  it("creating an item on a second iteration", () => {
    publish(IterationStarted({gameId: 'g1', columns: [{columnId: 'c1', taskName: 'todo'}]}));
    TestDate.advanceTime(1);
    publish(TaskCreated({gameId: 'g1', taskId: 't1', column: {columnId: 'c1', taskName: 'todo'}}))
    TestDate.advanceTime(1)
    publish(IterationStarted({gameId: 'g1'}));
    TestDate.advanceTime(1)
    publish(TaskCreated({gameId: 'g1', taskId: 't2', column: {columnId: 'c1', taskName: 'todo'}}))

    expect(stats.find('g1').history()).toMatchObject(
      [{time: 0, todo: 0}, {time: 1, todo: 1}, {time: 1, todo: 1}],
    )
  });
});
